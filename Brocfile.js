/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

var app = new EmberAddon();
app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/js/bootstrap.js');
app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot',{destDir: 'fonts', overwrite: true});
app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg',{destDir: 'fonts', overwrite: true});
app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf',{destDir: 'fonts', overwrite: true});
app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',{destDir: 'fonts', overwrite: true});
app.import('bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2',{destDir: 'fonts', overwrite: true});

module.exports = app.toTree();
