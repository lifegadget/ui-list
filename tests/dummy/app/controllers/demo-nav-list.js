import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  queryParams: ['mood','size','skin','position','selected'],

  items: [
    {title: 'Groceries', subHeading: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
    {title: 'Hospital', subHeading: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
    {title: 'Pub', subHeading: 'it\'s time for some suds', icon: 'beer'},
    {title: 'Took Cab', subHeading: 'took a cab, drinking not driving', icon: 'cab'},
    {title: 'Had Coffee', subHeading: 'need to chill out after that beer', icon: 'coffee'}
  ],
  position: 'left',
  selected: ['groceries'],
  mood: 'default',
  skin: 'default',
  size: 'default',
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
    },
    onError(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.danger(`onError event: ${o.message}`);
    }
  }
});
