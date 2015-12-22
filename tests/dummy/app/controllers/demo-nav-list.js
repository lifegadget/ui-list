import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  navigator: Ember.inject.service(),

  items: [
    {title: 'Groceries', subHeading: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
    {title: 'Hospital', subHeading: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
    {title: 'Pub', subHeading: 'it\'s time for some suds', icon: 'beer'},
    {title: 'Took Cab', subHeading: 'took a cab, drinking not driving', icon: 'cab'},
    {title: 'Had Coffee', subHeading: 'need to chill out after that beer', icon: 'coffee'}
  ],
  itemsJson: computed('items', function() {
    return JSON.stringify(this.get('items'), null, 2);
  }),
  position: 'left',
  mood: 'default',
  skin: 'default',
  size: 'default',
  subNavigation: computed.alias('navigator.secondaryRoute'),
  actions: {
    // in demo we'll accept all changes and send back into component
    onChange(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      if(o.action==='toggle') {
        flashMessages.success(`onChange Event: ${o.message}`);
      } else {
        flashMessages.warning(`onChange Event: ${o.message}`);
      }
    },
    onError(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.danger(`onError event: ${o.message}`);
    },
    changeSubNavigation(o) {
      if (o.type === 'selection') {
        this.set('subNavigation', o.selected);
        this.transitionToRoute(`demo-nav-list.${o.selected}`);
      }
    }
  }
});
