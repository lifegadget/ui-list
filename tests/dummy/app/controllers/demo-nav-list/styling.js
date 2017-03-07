import Ember from 'ember';
const { keys, create } = Object;  
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;   

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  queryParams: ['mood','size','skin','position'],

  skin: 'nav',
  size: 'default',
  position: 'left',
  mood: 'default',
  gaps: 0,
  ends: 0,

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
