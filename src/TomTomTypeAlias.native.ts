import type React from 'react';
import type { HostComponent, NativeMethods } from 'react-native';
import type { NativeTomTomViewProps } from './TomTomViewNativeComponent';

export type TomTomMapViewRef =
  React.ComponentRef<HostComponent<NativeTomTomViewProps>> & NativeMethods;
export type TomTomMap = null;
