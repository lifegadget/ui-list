import Ember from 'ember';
import DS from 'ember-data';
const { attr, hasMany, belongsTo } = DS; // jshint ignore:line
const { computed, observer, $, A, run, on, typeOf } = Ember;    // jshint ignore:line

export default Ember.Route.extend({

  model: function() {
    return this.store.peekAll('activity');
  },
  title: function(tokens) {
    return tokens.join(' - ') + ' | ui-list';
  },
  titleToken: 'demo app'
});
