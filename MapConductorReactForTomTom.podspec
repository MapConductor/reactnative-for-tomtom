require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name = "MapConductorReactForTomTom"
  s.version = package["version"]
  s.summary = package["description"]
  s.license = package["license"]
  s.author = package["author"]
  s.homepage = "https://github.com/mapconductor/react-sdk"
  s.source = { :path => __dir__ }
  s.platform = :ios, "16.1"
  s.source_files = "ios/*.{h,m,mm,swift}"
  # TomTom Orbis Maps SDK は TomTom 自身の spec repo で配られている（ArcGIS / HERE と違い
  # 公開 podspec がある）。アプリの Podfile に
  #   source 'https://api.tomtom.com/maps-sdk-ios/cocoapods'
  # を足す必要がある点だけ他プロバイダと違う。依存の書き方自体は素直な s.dependency。
  s.dependency "React-Core"
  s.dependency "MapConductorCore", "~> 1.3.0"
  s.dependency "MapConductorReactNativeCore"
  s.dependency "MapConductorReactMarkerClustering"
  s.dependency "MapConductorForTomTom", "~> 1.3.0"
end
