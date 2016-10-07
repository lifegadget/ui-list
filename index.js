/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-list',
  description: 'Lists for ambitious Ember applications',
  normalizeEntityName: function () { }, // no-op since we're just adding dependencies
  included: function (appOrAddon) {
    this._super.included(appOrAddon);
    var app = appOrAddon.app || appOrAddon;
    var options = typeof app.options === 'object' ? app.options : {};
    var addonConfig = options['ui-list'] || {};

    // If container is not using SCSS then just add styling as CSS
    if (!app.registry.availablePlugins['ember-cli-sass']) {
      app.import('vendor/ui-list/ui-list.css');
    }

  }
};
