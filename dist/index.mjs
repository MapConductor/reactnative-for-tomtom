// src/index.ts
import {
  TomTomDesign,
  TomTomViewState,
  useTomTomViewState
} from "@mapconductor/react-for-tomtom/state";

// src/TomTomViewController.native.ts
import { ReactNativeBridgeMapViewController } from "@mapconductor/js-sdk-react/internal";
var TomTomViewController = class extends ReactNativeBridgeMapViewController {
};

// src/TomTomMapViewHolder.native.ts
import { ReactNativeMapViewHolder } from "@mapconductor/js-sdk-react/internal";
var TomTomMapViewHolder = class extends ReactNativeMapViewHolder {
};

// src/TomTomViewNativeComponent.ts
import { requireNativeComponent } from "react-native";
import {
  toNativeCameraPosition,
  toNativeMarkerTilingOptions
} from "@mapconductor/js-sdk-react/internal";
var TomTomViewNativeComponent_default = requireNativeComponent(
  // Align to android/src/main/java/com/mapconductor/react/tomtom/MapConductorTomTomViewManager.kt
  // (REACT_CLASS) and ios/MapConductorTomTomViewManager.m (RCT_EXPORT_MODULE).
  "TomTomMapView"
);

// src/TomTomView.native.tsx
import { NativeMapViewHost } from "@mapconductor/js-sdk-react/internal";
import { jsx } from "react/jsx-runtime";
function TomTomMapView(props) {
  return /* @__PURE__ */ jsx(
    NativeMapViewHost,
    {
      ...props,
      nativeComponent: TomTomViewNativeComponent_default,
      mapDesignValue: props.state.mapDesignType.id,
      createController: (ref, camera) => new TomTomViewController(ref, camera)
    }
  );
}

// src/marker/TomTomMarkerController.native.ts
import {
  markerStateToNative
} from "@mapconductor/js-sdk-react/internal";
export {
  TomTomDesign,
  TomTomMapView,
  TomTomMapViewHolder,
  TomTomViewController,
  TomTomViewState,
  markerStateToNative,
  toNativeCameraPosition,
  toNativeMarkerTilingOptions,
  useTomTomViewState
};
