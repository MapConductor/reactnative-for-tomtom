import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createGeoPoint, createMapCameraPosition } from '@mapconductor/js-sdk-core';
import { TomTomDesign } from '@mapconductor/react-for-tomtom/state';
import { buildPackage } from './helpers/buildPackage.mjs';

// TomTomMapView は共有の NativeMapViewHost に「どのネイティブビューか」「デザインをどう文字列化するか」を
// 渡すだけの層。React を描画せず関数として呼び、返ってきた要素の props で受け渡しを確かめる。
// TomTom はデザインを id で渡す（getValue() の合成形でも SDK のスタイル名でもない）。
const { mod, cleanup } = await buildPackage('mapview-tests');
after(cleanup);
const { TomTomMapView, TomTomViewState, TomTomViewController, NativeMapViewHost, ReactNativeBridgeMapViewController } = mod;

test('the shared native host is rendered with the TomTomMapView native view', () => {
  const element = TomTomMapView({ state: new TomTomViewState() });
  assert.equal(element.type, NativeMapViewHost);
  // Android の REACT_CLASS / iOS の RCT_EXPORT_MODULE と揃っていないと
  // 「View config not found」で落ちる名前。
  assert.deepEqual(element.props.nativeComponent, { nativeViewName: 'TomTomMapView' });
  // このプロバイダはネイティブ固有の prop（API キー等）を渡さない。
  assert.equal(element.props.nativeProps, undefined);
});

test('the design value sent to native follows the state design', () => {
  const state = new TomTomViewState();
  assert.equal(TomTomMapView({ state }).props.mapDesignValue, 'standard');
  state.mapDesignType = TomTomDesign.StandardDark;
  assert.equal(TomTomMapView({ state }).props.mapDesignValue, 'standard-dark');
});

test('app props pass through to the host untouched', () => {
  const state = new TomTomViewState();
  const onMapClick = () => {};
  const props = TomTomMapView({ state, onMapClick, children: 'child' }).props;
  assert.equal(props.state, state);
  assert.equal(props.onMapClick, onMapClick);
  assert.equal(props.children, 'child');
});

test('createController builds a TomTomViewController bound to the native ref and initial camera', () => {
  const view = { nodeHandle: 7 };
  const camera = createMapCameraPosition({ position: createGeoPoint({ latitude: 35.68, longitude: 139.76 }), zoom: 12 });
  const controller = TomTomMapView({ state: new TomTomViewState() }).props.createController({ current: view }, camera);
  assert.ok(controller instanceof TomTomViewController);
  assert.ok(controller instanceof ReactNativeBridgeMapViewController);
  assert.equal(controller.getCameraPosition(), camera);
  assert.equal(controller.holder.mapView, view);
  controller.destroy();
});

test('the id is sent, not the composite getValue() string', () => {
  const design = TomTomDesign.Standard;
  const value = TomTomMapView({ state: new TomTomViewState({ mapDesignType: design }) }).props.mapDesignValue;
  assert.equal(value, design.id);
  assert.notEqual(value, design.getValue());
});
