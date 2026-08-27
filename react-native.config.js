module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath:
          'import com.mapconductor.react.tomtom.MapConductorTomTomPackage;',
        packageInstance: 'new MapConductorTomTomPackage()',
      },
      ios: {
        sourceDir: './ios',
      },
    },
  },
};
