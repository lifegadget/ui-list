import Ember from 'ember';
import DS from 'ember-data';
const { attr, hasMany, belongsTo } = DS;  
const { computed, observer, $, A, run, on, typeOf } = Ember;     

export default Ember.Route.extend({
  store: Ember.inject.service(),

  model: function() {
    return this.get('store').peekAll('activity');
  },
  title: function(tokens) {
    return tokens.join(' - ') + ' | ui-list';
  },
  titleToken: 'demo app'
});
