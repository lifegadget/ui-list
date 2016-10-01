/* jshint node: true */
'use strict';

module.exports = {
  name: 'ui-list',
  description: 'Lists for ambitious Ember applications',
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies
  included: function(app) {
    this._super.included(app);

  }
};
