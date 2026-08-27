import { requireNativeComponent } from 'react-native';
import type {
  NativeMapViewEvent,
  NativeMapViewProps,
} from '@mapconductor/js-sdk-react/internal';

// 共通のブリッジ props / イベント型は js-sdk-react に集約してある。
export type NativeTomTomViewEvent<T> = NativeMapViewEvent<T>;

export interface NativeTomTomViewProps extends NativeMapViewProps {
}

export {
  toNativeCameraPosition,
  toNativeMarkerTilingOptions,
  type NativeMarkerTilingOptions,
} from '@mapconductor/js-sdk-react/internal';

export default requireNativeComponent<NativeTomTomViewProps>(
  // Align to android/src/main/java/com/mapconductor/react/tomtom/MapConductorTomTomViewManager.kt
  // (REACT_CLASS) and ios/MapConductorTomTomViewManager.m (RCT_EXPORT_MODULE).
  'TomTomMapView'
);
