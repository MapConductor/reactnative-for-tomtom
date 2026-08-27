package com.mapconductor.react.tomtom

import com.mapconductor.react.wrapper.MapConductorMapViewCommands
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class MapConductorTomTomViewManager : SimpleViewManager<TomTomMapViewWrapper>() {
    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): TomTomMapViewWrapper =
        TomTomMapViewWrapper(reactContext)

    override fun onAfterUpdateTransaction(view: TomTomMapViewWrapper) {
        super.onAfterUpdateTransaction(view)
        view.initializeMapIfNeeded()
    }

    @ReactProp(name = "cameraPosition")
    fun setCameraPosition(
        view: TomTomMapViewWrapper,
        cameraPosition: ReadableMap?,
    ) {
        view.setCameraPosition(cameraPosition)
    }

    @ReactProp(name = "mapDesignType")
    fun setMapDesignType(
        view: TomTomMapViewWrapper,
        mapDesignType: String?,
    ) {
        view.setMapDesignType(mapDesignType)
    }

    @ReactProp(name = "infoBubblePositions")
    fun setInfoBubblePositions(
        view: TomTomMapViewWrapper,
        positions: ReadableArray?,
    ) {
        view.setInfoBubblePositions(positions)
    }

    @ReactProp(name = "markerTilingOptions")
    fun setMarkerTilingOptions(
        view: TomTomMapViewWrapper,
        options: ReadableMap?,
    ) {
        view.setMarkerTilingOptions(options)
    }

    override fun receiveCommand(
        root: TomTomMapViewWrapper,
        commandId: String,
        args: ReadableArray?,
    ) {
        // コマンド名の対応は全プロバイダ共通。写経すると綴り違いが黙って無効化されるため
        // js-sdk-react に集約してある。
        MapConductorMapViewCommands.receive(root, commandId, args)
    }

    override fun onDropViewInstance(view: TomTomMapViewWrapper) {
        view.onDropViewInstance()
        super.onDropViewInstance(view)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> =
        MapConductorMapViewCommands.directEventTypeConstants()

    companion object {
        const val REACT_CLASS = "TomTomMapView"
    }
}
