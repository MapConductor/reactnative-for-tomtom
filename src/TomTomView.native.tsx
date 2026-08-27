import { NativeMapViewHost } from '@mapconductor/js-sdk-react/internal';
import type { TomTomViewStateInterface } from '@mapconductor/react-for-tomtom/state';
import { TomTomViewController } from './TomTomViewController.native';
import type { TomTomMapViewProps } from './TomTomViewProps.native';
import type { TomTomMapViewRef } from './TomTomTypeAlias.native';
import NativeTomTomMapView from './TomTomViewNativeComponent';

/**
 * ネイティブイベントの配線・オーバーレイ収集・InfoBubble レイヤは全 RN プロバイダで
 * 同一なので {@link NativeMapViewHost} に集約してある。ここで渡すのは
 * 「どのネイティブビューか」「デザインをどう文字列化するか」だけ。
 */
export function TomTomMapView(props: TomTomMapViewProps) {
  return (
    <NativeMapViewHost<TomTomMapViewRef, TomTomViewStateInterface>
      {...props}
      nativeComponent={NativeTomTomMapView}
      // web の `getValue()`（`mapDesign_id=...,style=...`）ではなく **id そのもの**を渡す。
      // ネイティブ側は android が `TomTomMapDesign.create`、iOS が
      // `TomTomMapDesign.Create` で引く。どちらも未知 id は Standard に落とす。
      // web だけ id が多い（`standard-light` / `mono-dark` 等）が、ネイティブの
      // カタログは standard / driving / satellite の 3 つなので、それ以外を送ると
      // Standard になる。reactnative-for-maptiler / -longdo と同じ取り決め。
      //
      // API キーはここに載せない。android は AndroidManifest の meta-data
      // `TOMTOM_API_KEY`、iOS は Info.plist の `TomTomAPIKey` から**ネイティブが**引く。
      mapDesignValue={props.state.mapDesignType.id}
      createController={(ref, camera) => new TomTomViewController(ref, camera)}
    />
  );
}
