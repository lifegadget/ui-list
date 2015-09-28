import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  queryParams: ['mood','size','skin','position'],

  items: [
    {foo: 'Groceries', bar: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
    {foo: 'Hospital', bar: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
    {foo: 'Pub', bar: 'it\'s time for some suds', icon: 'beer'},
    {foo: 'Took Cab', bar: 'took a cab, drinking not driving', icon: 'cab'},
    {foo: 'Had Coffee', bar: 'need to chill out after that beer', icon: 'coffee'}
  ],
  position: 'left',
  map: {
    title: 'foo',
    subHeading: 'bar'
  },
  sillyLogic: function(item) {
    let badge = item.get('badge');
    let moodiness = badge && badge > 5 ? 'error' : 'warning';
    return badge ? moodiness : null;
  },
  mood: 'default',
  skin: 'default',
  size: 'default',
  actions: {
    // in demo we'll accept all changes and send back into component
    onChange(action, item) {
      const flashMessages = Ember.get(this, 'flashMessages');
      console.log('changed: %o', item);
      if(action==='selected') {
        flashMessages.success(`onChange Event: ${action} on ${item.elementId}`);
      } else {
        flashMessages.warning(`onChange Event: ${action} on ${item.elementId}`);
      }
    },
    onError(code, item) {
      const flashMessages = Ember.get(this, 'flashMessages');
      const title = Ember.get(item, 'title');
      flashMessages.danger(`onError event: ${code} when interacting with "${title}"`);
    }
  }
});
