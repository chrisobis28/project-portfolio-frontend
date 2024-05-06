// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma'),
      ],
      client: {
        clearContext: false, // leave Jasmine Spec Runner output visible in browser
      },
      jasmineHtmlReporter: {
        suppressAll: true, // removes the duplicated traces
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/skooltrak'),
        subdir: '.',
        reporters: [{ type: 'html' }, { type: 'text-summary' }],
      },
      reporters: ['progress', 'kjhtml'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      browserNoActivityTimeout: 50000,
      browserSocketTimeout: 50000,
      autoWatch: true,
      browsers: ['Chrome'],
      customLaunchers: {
        'Chrome-Headless': {
          base: 'Chrome',
          flags: [
            '--no-sandbox',
            '--headless',
            '--remote-debugging-port=9876',
            '--js-flags="--max_old_space_size=4096"',
          ],
        },
      },
      singleRun: false,
      restartOnFileChange: true,
      files: [
        'src/vendor/scripts/jitsi.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/summernote/dist/summernote-lite.min.js',
      ],
    });
  };
  