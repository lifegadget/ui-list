import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line


export default Ember.Controller.extend({

  queryParams: ['mood','size','style','compressed'],
  appointments: computed(function() {
    return this.store.findAll('appointment');
  }),
  columns: ['firstName', 'lastName'],

  actions: {
    onUpdate(action, info) {
      const flashMessages = Ember.get(this, 'flashMessages');
      const titles = new A(info.new).mapBy('foo').join(', ');
      flashMessages.success(`onChange Event: ${action}; element dragged was "${info.dragged.foo}". Order now: ${titles}`);

      this.set('items', info.new);
    },
    onClick(item, options) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`onClick Event. Pane was ${options.pane}; item originating was ${item.elementId} ... "${item.get('title')}"`);
    }
  }

});
