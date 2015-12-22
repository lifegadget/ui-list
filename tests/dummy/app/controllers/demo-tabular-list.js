import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  navigator: inject.service(),
  subNav: computed.alias('navigator.secondaryRoute'),
  queryParams: ['mood','size','style','compressed'],

  actions: {
    navSubMenu(o) {
      if(o.type === 'selection') {
        this.transitionToRoute(`demo-tabular-list.${o.selected}`);
      }
    }
  }
});
