import Ember from 'ember';
const { computed, observer, $, A, run, on } = Ember;    // jshint ignore:line

export default Ember.Controller.extend({
  flashMessages: Ember.inject.service(),
  queryParams: ['mood','size','skin','selected'],

  selected: [],
  items: [
    {title: 'Groceries', subHeading: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
    {title: 'Hospital', subHeading: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
    {title: 'Pub', subHeading: 'it\'s time for some suds', icon: 'beer'},
    {title: 'Took Cab', subHeading: 'took a cab, drinking not driving', icon: 'cab'},
    {title: 'Had Coffee', subHeading: 'need to chill out after that beer', icon: 'coffee'}
  ],
  mood: 'default',
  skin: 'default',
  size: 'default',
  actions: {
    onChange: function(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`onChange Event: ${o.message}`);
      console.log('onChange: %o', o);
      if(o.type === 'selection') {
        this.set('selected', o.selected);
      }
    },
    onError: function(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.warning(`onError event: ${o.message}`);
      console.log('onError: %o', o);
    }
  },
  min: 0,
  max: 1


});
