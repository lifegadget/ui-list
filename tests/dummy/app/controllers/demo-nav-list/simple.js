import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  selected: 'foo',
  actions: {
    // in demo we'll accept all changes and send back into component
    onChange(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      if(o.action==='toggle') {
        flashMessages.success(`onChange Event: ${o.message}`);
      } else {
        flashMessages.warning(`onChange Event: ${o.message}`);
      }
      if(o.type === 'selection') {
        this.set('selected', o.selected);
      }
    }
  }
});
