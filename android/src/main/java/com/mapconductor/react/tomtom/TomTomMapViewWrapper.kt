package com.mapconductor.react.tomtom

import android.content.Context
import android.view.View
import androidx.compose.ui.geometry.Offset
import com.mapconductor.core.features.GeoPointInterface
import com.mapconductor.core.map.MapCameraPosition
import com.mapconductor.core.map.MutableMapServiceRegistry
import com.mapconductor.core.marker.MarkerTilingOptions
import com.mapconductor.react.wrapper.MapConductorMapViewWrapperBase
import com.mapconductor.react.wrapper.MapConductorReactNativeHost
import com.mapconductor.react.wrapper.MapConductorReactNativeHostDelegate
import com.mapconductor.tomtom.TomTomMapDesign
import com.mapconductor.tomtom.TomTomMapDesignType
import com.mapconductor.tomtom.TomTomMapViewController
import com.mapconductor.tomtom.TomTomMapViewHolder
import com.mapconductor.tomtom.TomTomMapViewScope
import com.mapconductor.tomtom.createTomTomMapViewController
import com.mapconductor.tomtom.setupMarkerTileRaster
import com.mapconductor.tomtom.tomtomApiKey
import com.tomtom.sdk.map.display.MapOptions
import com.tomtom.sdk.map.display.ui.MapView

/**
 * RN の TomTom Orbis ビュー。
 *
 * コマンドの受け口・マーカー取り込み・スクリーン座標の通知・拡張の Compose レイヤは
 * [MapConductorMapViewWrapperBase]（js-sdk-react/android）が全部持っているので、
 * ここはプロバイダ固有のアダプタを差すだけ。
 */
class TomTomMapViewWrapper(context: Context) : MapConductorMapViewWrapperBase(context) {
    override val host: MapConductorReactNativeHost = TomTomReactNativeHost()
}

/**
 * TomTom の地図一式を RN のラッパー基底が扱える形へ翻訳する。
 *
 * **Compose は経由しない。** TomTom は SDK 側にネイティブのアノテーションがあり、
 * マーカーを Compose オーバーレイで描く必要がない（Longdo / MapTiler とはそこが違う）。
 * Compose 版 `TomTomMapView` が使う [createTomTomMapViewController] は
 * 「Compose と RN のような非 Compose ホストの両方から使う」ために公開されているので、
 * ここでも**同じファクトリを通す**（組み直すと片方だけ配線が増えて食い違う）。
 *
 * **API キーは JS から渡さない。** `tomtomApiKey(context)` が AndroidManifest の
 * meta-data `TOMTOM_API_KEY` から引く。未設定なら例外を投げて落ちる（SDK 側の仕様）。
 */
private class TomTomReactNativeHost : MapConductorReactNativeHost {
    override val providerName = "TomTom"
    override val extensionScope = TomTomMapViewScope()
    override val serviceRegistry = MutableMapServiceRegistry()

    private var mapView: MapView? = null
    private var holder: TomTomMapViewHolder? = null
    private var controller: TomTomMapViewController? = null
    private var mapDesign: TomTomMapDesignType = TomTomMapDesign.Standard

    override fun createMapView(
        context: Context,
        initialCamera: MapCameraPosition,
        markerTiling: MarkerTilingOptions,
        delegate: MapConductorReactNativeHostDelegate,
    ): View {
        val apiKey = tomtomApiKey(context)
        val options =
            MapOptions(
                mapKey = apiKey,
                // Compose 版と同じく TextureView 描画。false にすると RN のビュー階層で
                // 地図が他のビューを突き抜けて描画される。
                renderToTexture = true,
            )
        val nativeMapView = MapView(context, options)
        // Compose 版は LocalLifecycleOwner に同期させているが、RN にその足場が無いので
        // ここで直接鳴らす。**onStart / onResume が届かないとタイルが出ない**
        // （View だけ出て真っ白になる。Compose 版のコメントが指しているのと同じ穴）。
        nativeMapView.onCreate(null)
        nativeMapView.onStart()
        nativeMapView.onResume()
        mapView = nativeMapView

        nativeMapView.getMapAsync { map ->
            if (!delegate.isAttached) return@getMapAsync
            val mapHolder = TomTomMapViewHolder(nativeMapView, map)
            holder = mapHolder
            val viewController =
                createTomTomMapViewController(
                    holder = mapHolder,
                    markerTiling = markerTiling,
                    serviceRegistry = serviceRegistry,
                )
            controller = viewController
            // 大量マーカーをラスタタイル化する経路の配線。Compose 版の
            // controllerProvider が呼んでいるのと同じもの。
            viewController.setupMarkerTileRaster(
                apiKey = apiKey,
                cacheDir = context.cacheDir,
            )
            delegate.onControllerReady(viewController)
            delegate.onMapLoaded()
            nativeMapView.post {
                // スタイル読み込みがカメラを戻すことがあるので、貼り付いてから入れ直す
                // （Compose 版の `holder.mapView.post { ... }` と同じ理由）。
                viewController.moveCamera(initialCamera)
                viewController.onMarkerRenderingReady()
                // デザインの適用は地図が貼り付いてから。生成直後に呼ぶと `loadStyle` が
                // 早すぎる。
                viewController.setMapDesignType(mapDesign)
            }
        }
        return nativeMapView
    }

    override fun setMapDesign(id: String?) {
        // JS が渡すのは id そのもの（`TomTomView.native.tsx` を参照）。
        // `create` は未知 id を Standard に落とす。
        mapDesign = id?.takeIf { it.isNotBlank() }?.let { TomTomMapDesign.create(it) } ?: TomTomMapDesign.Standard
        controller?.setMapDesignType(mapDesign)
    }

    /** 投影は TomTom のネイティブ API をホルダーが持つ。JS 側へ逃がさないこと。 */
    override fun toScreenOffset(position: GeoPointInterface): Offset? = holder?.toScreenOffset(position)

    override fun destroy() {
        controller?.destroy()
        controller = null
        holder = null
        mapView?.onPause()
        mapView?.onStop()
        mapView?.onDestroy()
        mapView = null
    }
}
