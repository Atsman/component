const webpackBase = require('./webpack.base');

const TEST_PATH = './src/**/*.test.js';

module.exports = function(config) {
  config.set({
    browsers: ['ChromeCanary'],

    frameworks: ['mocha'],

    files: [
      { pattern: TEST_PATH, watched: true },
    ],
    
    preprocessors: {
      [TEST_PATH]: ['webpack'],
    },

    webpack: webpackBase,

  });
};

