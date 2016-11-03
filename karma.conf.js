module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha','chai'],
    plugins: [
      'karma-mocha',
      'karma-chai'
    ],
    files: [
      'tests/**/app*.js',
      'public/**/app*.js'
    ],
    client: {
      mocha: {
        ui: 'bdd',
        grep: '',
      },
      chai: {
        includeStack: true
      }
    },
    failOnEmptyTestSuite: false,
    autoWatch: true
  })
}
