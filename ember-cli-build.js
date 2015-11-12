/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot',{destDir: 'fonts', overwrite: true});
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg',{destDir: 'fonts', overwrite: true});
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf',{destDir: 'fonts', overwrite: true});
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',{destDir: 'fonts', overwrite: true});
  app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2',{destDir: 'fonts', overwrite: true});

  return app.toTree();
};
