# @mapconductor/reactnative-for-tomtom

MapConductor の TomTom Orbis 用 React Native プロバイダーです。Web 用の
`@mapconductor/react-for-tomtom` とは別パッケージで、Android の
`com.mapconductor:for-tomtom` と iOS の `MapConductorForTomTom` を薄くラップします。

## 使い方

```tsx
import {
  TomTomDesign,
  TomTomMapView,
  useTomTomViewState,
} from '@mapconductor/reactnative-for-tomtom';

export function MapPage() {
  const state = useTomTomViewState({
    id: 'main-map',
    mapDesignType: TomTomDesign.Standard,
  });

  return <TomTomMapView state={state} style={{ flex: 1 }} />;
}
```

通常のオーバーレイは `@mapconductor/js-sdk-react` の `Marker`、`Markers`、
`Polyline`、`Polygon`、`Circle`、`GroundImage`、`RasterLayer` を子として宣言します。
大量のマーカーには、1 マーカーごとの React effect を作らない `Markers` を使用してください。

## API キー

**JS からは渡しません。** ネイティブが設定ファイルから引きます。

| | 置き場所 | キー名 |
|---|---|---|
| Android | AndroidManifest の meta-data | `TOMTOM_API_KEY` |
| iOS | Info.plist | `TomTomAPIKey` |

キー名がプラットフォームで違う点に注意してください（それぞれのネイティブ SDK 側の
取り決めに合わせています）。Android は未設定だと `tomtomApiKey()` が例外を投げて落ちます。

## ★ デザインのカタログは web より狭い

web の `TomTomDesign` は `standard-light` / `mono-dark` などの派生 id を持ちますが、
**android / iOS が引けるのは `standard` / `driving` / `satellite` の 3 つだけ**で、
それ以外の id は `Standard` に丸められます（android は `TomTomMapDesign.create`、
iOS は `TomTomMapDesign.Create`）。RN 側は id をそのままネイティブへ送るので、
派生 id を選んでも「選べるのに何も変わらない」状態になります。

## ★ iOS の SDK は CocoaPods の spec repo からは引けない

`MapConductorForTomTom.podspec` のコメントは
`source 'https://api.tomtom.com/maps-sdk-ios/cocoapods'` を挙げていますが、
**この URL は 404 を返します**（2026-08-19 実測）。TomTom が公開しているのは
artifactory 上の tarball だけです。

そこで `ios-sdk/ios-for-tomtom/podspecs/` に**メタデータだけの podspec を 11 本**置き、
CocoaPods に TomTom の artifactory から直接ダウンロードさせます。
`ios-for-arcgis/ArcGIS.podspec` と同じ考え方です。

```ruby
# ios-for-tomtom/podspecs/TomTomSDKMapDisplay.podspec（抜粋）
s.source = {
  :http => 'https://repositories.tomtom.com/artifactory/cocoapods/TomTomSDKMapDisplay/0.73.1/TomTomSDKMapDisplay.tar.gz',
  :sha256 => '1660e80cb8cc95c890f3762222ec9277dc1ad8499338d362d2cfa62a91899873',
}
s.vendored_frameworks = 'TomTomSDKMapDisplay.xcframework'
```

**MapConductor は TomTom のバイナリを一切持ちません。**（再配布する権利がないため。
`ios-for-tomtom/.gitignore` は `Frameworks/` を丸ごと除外しており、fetch 済みの
xcframework も同梱 podspec も git 追跡されていません。）実体は毎回 TomTom から
降りてくるので、SPM 利用者と CocoaPods 利用者が同じ tarball・同じ checksum の
バイナリを掴みます。

アプリの Podfile では 11 本を名指しします。CocoaPods にこの spec を置く spec repo が
無いため、利用者がファイル（または raw URL）を指すしかありません。

```ruby
%w[
  TomTomSDKCommon TomTomSDKFeatureToggle TomTomSDKLocationProvider
  TomTomSDKBindingFrameworkLoggingInternal TomTomSDKBindingMapDisplayEngineInternal
  TomTomSDKBindingMapDisplayElasticDataProviderInternal TomTomSDKMapTileStoreCommon
  TomTomSDKTelemetry TomTomSDKRoute TomTomSDKRoutingCommon TomTomSDKMapDisplay
].each do |name|
  pod name, :podspec =>
    "https://raw.githubusercontent.com/MapConductor/ios-for-tomtom/1.3.1/podspecs/#{name}.podspec"
end
```

`scripts/fetch-tomtom-sdk.sh` は SPM の `binaryTarget` 用にローカルへ落とすためのもので、
CocoaPods 経路には要りません（`Frameworks/` を退避した状態で `pod install` が通ることを
確認済み）。

バージョンを上げるときは `fetch-tomtom-sdk.sh` の `VER`、`Package.swift` の
`tomtomFrameworks`、`podspecs/*.podspec` の `s.version` と `:sha256` を**同時に**
合わせてください。片方だけ上げると SPM 経路と CocoaPods 経路で別バージョンをビルドします。

## ★ Android のスタイル: Orbis ではなく classic を使う（android-sdk 側で修正済み）

`StandardStyles.TomTomOrbisMaps.*`（`tomtom://styles/standard/orbismap/browsing` 等）を
`loadStyle` に渡すと、**success を返すのに何も描画されません**（地色だけの地図）。
API 側も `api.tomtom.com/maps/orbis/map-display/...` が 400 を返し、classic の
`api.tomtom.com/map/1/tile/basic/main/...` は 200 を返します。Orbis のベクタ地図は
別建ての権限が要り、キーがそれを持たないと**エラーではなく無音の白紙**になります。

`android-for-tomtom` の `TomTomMapDesign` を classic の `StandardStyles.TomTomMaps.*` へ
変更済みです（`MapOptions.mapStyle` の既定は `null` = SDK 内部の既定スタイルで、これは
描画されます。その挙動に合わせた形）。

**iOS は影響を受けません**（iOS SDK 側は Orbis の `StyleContainer` で正常に描画されます）。

### ★ Android は OkHttp を 4.x に固定すること

TomTom Orbis Maps SDK 2.4.x は OkHttp 4.x でビルドされています。**OkHttp 5.x が
classpath に載ると、衛星（ラスタ）スタイルからベクタスタイルへ戻したときに地図が
地色一色になります。** `loadStyle` は `onSuccess` を返し、`map.layers.size` も
BROWSING の 137 レイヤーを数え、カメラも正しいのに、タイルが一切描かれません。
例外も HTTP エラーも出ない無音の失敗で、パンしても戻りません。
ベクタ→ベクタ（Standard ⇄ Driving）は壊れません。**ラスタ→ベクタだけ**です。

引き金は推移依存です。ArcGIS Maps SDK for Kotlin 300.1.0 が `okhttp 5.3.2` を要求し、
Gradle の「高いほうが勝つ」解決で TomTom の `4.12.0` が `5.3.2` へ引き上げられます。
複数の地図 SDK を同居させるアプリでしか出ず、TomTom 単体のアプリでは決して再現しない
のはこのためです。

アプリの `android/app/build.gradle` に入れてください（`examples/reactnative-basic`
は既に入っています）。React Native 本体も okhttp 4.9.x 系なので、4.12.0 に揃えるのが
安全です。

```gradle
configurations.configureEach {
  resolutionStrategy {
    force 'com.squareup.okhttp3:okhttp:4.12.0'
  }
}
```

実機（Pixel 5a / map-display 2.4.2）で両方向を確認しています。検証表と TomTom へ送る
報告書は `android-sdk/android-for-tomtom/docs/tomtom-okhttp5-raster-to-vector-report.md`。

**iOS は影響を受けません。**

## ★ Android は Compose を経由しない

TomTom は SDK 側にネイティブのアノテーションがあり、マーカーを Compose オーバーレイで
描く必要がありません（Longdo / MapTiler とはそこが違います）。Compose 版 `TomTomMapView`
が使う `createTomTomMapViewController` は「Compose と RN のような非 Compose ホストの
両方から使う」ために公開されているので、RN ラッパーも**同じファクトリを通します**。

ただし `MapView` のライフサイクル（`onCreate` / `onStart` / `onResume`）は Compose 版が
`LocalLifecycleOwner` に同期させている分を RN ラッパーが自分で鳴らします。
**これが届かないとタイルが出ません**（View だけ出て真っ黒になります）。

TomTom Orbis SDK 2.x はプロダクトフレーバー次元 `tomtom-sdk-version` を持つので、
アプリ側にも `missingDimensionStrategy("tomtom-sdk-version", "complete")` が要ります。
SDK は TomTom の maven（`https://repositories.tomtom.com/artifactory/maven`）でしか
配られていません。
