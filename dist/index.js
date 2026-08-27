"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TomTomDesign: () => import_state.TomTomDesign,
  TomTomMapView: () => TomTomMapView,
  TomTomMapViewHolder: () => TomTomMapViewHolder,
  TomTomViewController: () => TomTomViewController,
  TomTomViewState: () => import_state.TomTomViewState,
  markerStateToNative: () => import_internal5.markerStateToNative,
  toNativeCameraPosition: () => import_internal3.toNativeCameraPosition,
  toNativeMarkerTilingOptions: () => import_internal3.toNativeMarkerTilingOptions,
  useTomTomViewState: () => import_state.useTomTomViewState
});
module.exports = __toCommonJS(index_exports);
var import_state = require("@mapconductor/react-for-tomtom/state");

// src/TomTomViewController.native.ts
var import_internal = require("@mapconductor/js-sdk-react/internal");
var TomTomViewController = class extends import_internal.ReactNativeBridgeMapViewController {
};

// src/TomTomMapViewHolder.native.ts
var import_internal2 = require("@mapconductor/js-sdk-react/internal");
var TomTomMapViewHolder = class extends import_internal2.ReactNativeMapViewHolder {
};

// src/TomTomViewNativeComponent.ts
var import_react_native = require("react-native");
var import_internal3 = require("@mapconductor/js-sdk-react/internal");
var TomTomViewNativeComponent_default = (0, import_react_native.requireNativeComponent)(
  // Align to android/src/main/java/com/mapconductor/react/tomtom/MapConductorTomTomViewManager.kt
  // (REACT_CLASS) and ios/MapConductorTomTomViewManager.m (RCT_EXPORT_MODULE).
  "TomTomMapView"
);

// src/TomTomView.native.tsx
var import_internal4 = require("@mapconductor/js-sdk-react/internal");
var import_jsx_runtime = require("react/jsx-runtime");
function TomTomMapView(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_internal4.NativeMapViewHost,
    {
      ...props,
      nativeComponent: TomTomViewNativeComponent_default,
      mapDesignValue: props.state.mapDesignType.id,
      createController: (ref, camera) => new TomTomViewController(ref, camera)
    }
  );
}

// src/marker/TomTomMarkerController.native.ts
var import_internal5 = require("@mapconductor/js-sdk-react/internal");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TomTomDesign,
  TomTomMapView,
  TomTomMapViewHolder,
  TomTomViewController,
  TomTomViewState,
  markerStateToNative,
  toNativeCameraPosition,
  toNativeMarkerTilingOptions,
  useTomTomViewState
});
