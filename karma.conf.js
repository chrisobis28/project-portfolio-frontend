module.exports = function(config) {
    config.set({
      // Specify the files that Karma will use to run the tests
      files: [
        // Add your test files and dependencies here
      ],
  
      // Define the testing frameworks to be used
      frameworks: ["jasmine", "@angular-devkit/build-angular"],
  
      // Specify the browsers to be used for testing
      browsers: ["Chrome"],
  
      // Define custom launchers (optional)
      customLaunchers: {
        Headless_Chrome: {
          base: "Chrome",
          flags: ["--no-sandbox", "--disable-gpu", "--headless", "--remote-debugging-port=9222"],
        },
      }
    });
  };