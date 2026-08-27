import MapConductorCore
@_spi(MapConductorDriver) import MapConductorForTomTom
import MapConductorReactMarkerClustering
import MapConductorReactNativeCore
import UIKit

/// RN の TomTom Orbis ビュー。
///
/// コマンドの受け口・マーカー取り込み・スクリーン座標の通知は
/// ``MCReactNativeMapViewBase``（js-sdk-react/ios）が全部持っているので、ここは
/// プロバイダ固有のアダプタを差すだけ。
@objc(MCTomTomReactNativeView)
public final class TomTomReactNativeView: MCReactNativeMapViewBase {
    public override func makeHost() -> MCReactNativeMapHost {
        TomTomReactNativeHost()
    }
}

/// `TomTomMapHost`（ios-sdk）を RN の基底クラスが扱える非ジェネリックな形へ翻訳する。
@MainActor
final class TomTomReactNativeHost: MCReactNativeMapHost {
    weak var mcDelegate: MCReactNativeMapHostDelegate?

    private let state = TomTomMapViewState(id: "rn-tomtom", mapDesignType: TomTomMapDesign.Standard)
    private lazy var mapHost: TomTomMapHost = {
        TomTomMapHost(
            state: state,
            handlers: MapViewHandlers(
                onMapLoaded: { [weak self] _ in self?.mcDelegate?.mcMapLoaded() },
                onMapClick: { [weak self] point in self?.mcDelegate?.mcMapClick(point) },
                onMapLongClick: { [weak self] point in self?.mcDelegate?.mcMapLongClick(point) },
                onCameraMoveStart: { [weak self] camera in self?.mcDelegate?.mcCameraMoveStart(camera) },
                onCameraMove: { [weak self] camera in self?.mcDelegate?.mcCameraMove(camera) },
                onCameraMoveEnd: { [weak self] camera in self?.mcDelegate?.mcCameraMoveEnd(camera) }
            )
        )
    }()

    var mcServiceRegistry: MutableMapServiceRegistry { state.serviceRegistry }
    var mcCameraZoom: Double { state.cameraPosition.zoom }

    func mcMakeMapView(content: MapViewContent) -> UIView {
        // API キーは JS からは渡さない。`TomTomMapHost.resolveApiKey(nil)` が
        // Info.plist の `TomTomAPIKey` から引く（SwiftUI 版と同じ経路）。
        mapHost.makeMapView(apiKey: nil, cameraRestriction: nil, content: content)
    }

    func mcUpdateContent(_ content: MapViewContent) {
        // TomTom の `updateContent` は末尾で `infoBubbleCoordinator?.updateAllLayouts()` を
        // 呼ぶので、MapTiler のような `updateInfoBubbleLayouts()` の追い打ちは要らない。
        mapHost.updateContent(content)
    }

    func mcSyncNativeViewSettings() {
        // SwiftUI 版 `TomTomMapViewRepresentable.updateUIView` と同じ順で同じものを呼ぶ。
        // 手順が二重になっていると片方だけ直るため、増やすときは向こうも直すこと。
        mapHost.applyDesign(state.mapDesignType)
        mapHost.updateGestures(state.uiSettings)
    }

    func mcUnbind() {
        mapHost.unbind()
    }

    func mcSetMapDesign(id: String?) {
        // JS が送るのは `getValue()` ではなく id そのもの（TomTomView.native.tsx を参照）。
        // `Create` は未知 id を Standard に落とす。web だけ `standard-light` 等の
        // 派生 id を持つが、ネイティブのカタログは 3 つなのでそこへ丸める。
        state.mapDesignType = id.map { TomTomMapDesign.Create(id: $0) } ?? TomTomMapDesign.Standard
    }

    func mcMoveCamera(_ camera: MapCameraPosition, durationMillis: Int64?) {
        if let durationMillis {
            state.moveCameraTo(cameraPosition: camera, durationMillis: durationMillis)
        } else {
            state.moveCameraTo(cameraPosition: camera)
        }
    }

    func mcFitBounds(_ bounds: GeoRectBounds, padding: Int) {
        state.fitBounds(bounds: bounds, padding: padding)
    }

    func mcApplyUISettings(_ settings: MapUISettings) {
        state.uiSettings = settings
    }

    func mcToScreenOffset(_ position: GeoPointProtocol) -> CGPoint? {
        state.getMapViewHolder()?.toScreenOffset(position: position)
    }

    func mcMakeLocalExtensionRenderer(
        type: String,
        extensionId: String,
        eventSink: @escaping NativeMapExtensionEventSink
    ) -> NativeMapExtensionRenderer? {
        guard type == "marker-clustering" else { return nil }
        return MarkerClusterExtensionRenderer<TomTomActualMarker>(extensionId: extensionId, eventSink: eventSink)
    }
}
