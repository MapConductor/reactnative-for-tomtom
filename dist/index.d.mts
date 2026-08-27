import { TomTomViewStateInterface } from '@mapconductor/react-for-tomtom/state';
export { TomTomDesign, TomTomMapDesignType, TomTomViewState, TomTomViewStateInterface, TomTomViewStateParams, useTomTomViewState } from '@mapconductor/react-for-tomtom/state';
import * as React from 'react';
import React__default from 'react';
import { HostComponent, NativeMethods, StyleProp, ViewStyle } from 'react-native';
import { NativeMapViewEvent, NativeMapViewProps, ReactNativeBridgeMapViewController, ReactNativeMapViewHolder } from '@mapconductor/js-sdk-react/internal';
export { NativeMarkerTilingOptions, NativeMarkerStatePayload as NativeTomTomMarkerState, markerStateToNative, toNativeCameraPosition, toNativeMarkerTilingOptions } from '@mapconductor/js-sdk-react/internal';
import { MapViewControllerInterface, MarkerTilingOptions } from '@mapconductor/js-sdk-core';
import { MapViewBaseProps } from '@mapconductor/js-sdk-react/native';

type NativeTomTomViewEvent<T> = NativeMapViewEvent<T>;
interface NativeTomTomViewProps extends NativeMapViewProps {
}

type TomTomMapViewRef = React__default.ComponentRef<HostComponent<NativeTomTomViewProps>> & NativeMethods;
type TomTomMap = null;

type TomTomViewControllerInterface = MapViewControllerInterface;

/**
 * ネイティブブリッジの実装は全 RN プロバイダで同一なので
 * {@link ReactNativeBridgeMapViewController} に集約してある。ここはネイティブビューの
 * ref 型を与えるだけ。プロバイダ固有の振る舞いが要るときだけメソッドを override する。
 */
declare class TomTomViewController extends ReactNativeBridgeMapViewController<TomTomMapViewRef> {
}

/**
 * RN のホルダーは全プロバイダで同一（投影はネイティブ側が行う）なので
 * {@link ReactNativeMapViewHolder} に集約してある。ここは ref 型を与えるだけ。
 *
 * **投影を JS 側へ書き足さないこと。** TomTom は android / iOS とも SDK が同期投影を
 * 持っており（`TomTomMap.pointForCoordinate` / `TomTomMapViewHolder.toScreenOffset`）、
 * JS にもう一度書くと式が 2 か所に増え、タップの当たり判定（ネイティブ側にしかない）と
 * 食い違う。
 */
declare class TomTomMapViewHolder extends ReactNativeMapViewHolder<TomTomMapViewRef> {
}

interface TomTomMapViewProps extends MapViewBaseProps<TomTomViewStateInterface> {
    maxZoom?: number;
    minZoom?: number;
    className?: string;
    containerStyle?: StyleProp<ViewStyle>;
    onError?: (error: Error) => void;
    children?: React__default.ReactNode;
    markerTilingOptions?: MarkerTilingOptions;
}

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
declare function TomTomMapView(props: TomTomMapViewProps): React.JSX.Element;

export { type NativeTomTomViewEvent, type NativeTomTomViewProps, type TomTomMap, TomTomMapView, TomTomMapViewHolder, type TomTomMapViewProps, type TomTomMapViewRef, TomTomViewController, type TomTomViewControllerInterface };
