import { ReactNativeMapViewHolder } from '@mapconductor/js-sdk-react/internal';
import type { TomTomMapViewRef } from './TomTomTypeAlias.native';

/**
 * RN のホルダーは全プロバイダで同一（投影はネイティブ側が行う）なので
 * {@link ReactNativeMapViewHolder} に集約してある。ここは ref 型を与えるだけ。
 *
 * **投影を JS 側へ書き足さないこと。** TomTom は android / iOS とも SDK が同期投影を
 * 持っており（`TomTomMap.pointForCoordinate` / `TomTomMapViewHolder.toScreenOffset`）、
 * JS にもう一度書くと式が 2 か所に増え、タップの当たり判定（ネイティブ側にしかない）と
 * 食い違う。
 */
export class TomTomMapViewHolder extends ReactNativeMapViewHolder<TomTomMapViewRef> {}
