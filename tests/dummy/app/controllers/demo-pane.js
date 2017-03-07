import Ember from 'ember';
const { keys, create } = Object;  
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;   


export default Ember.Controller.extend({

  queryParams: ['orient','horzontal','vertical'],

  orient: 'horizontal',
  vertical: null,
  horizontal: null,

  items: [
    Ember.Object.create({when: 2, foo: 'Groceries', bar: 'hungry, hungry, hippo', icon: 'shopping-cart', badge: 1}),
    Ember.Object.create({when: 3, foo: 'Hospital', bar: 'visit sick uncle Joe', icon: 'ambulance', badge: 6}),
    Ember.Object.create({when: 4, foo: 'Pub', bar: 'it\'s time for some suds', icon: 'beer'}),
    Ember.Object.create({when: 5, foo: 'Took Cab', bar: 'took a cab, drinking not driving', icon: 'cab'}),
    Ember.Object.create({when: 6, foo: 'Had Coffee', bar: 'need to chill out after that beer', icon: 'coffee'}),
    Ember.Object.create({when: 1, foo: 'Ate Breakfast', bar: 'start of every good morning', icon: 'cutlery'})
  ],
  map: {
    title: 'foo',
    subHeading: 'bar'
  },

  actions: {
    onClick(item, options) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`onClick Event. Pane was ${options.pane}; item originating was ${item.elementId} ... "${item.get('title')}"`);
    }
  }

});
