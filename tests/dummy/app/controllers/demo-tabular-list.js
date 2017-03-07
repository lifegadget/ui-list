import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

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
