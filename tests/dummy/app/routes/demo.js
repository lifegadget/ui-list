import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    controller.set('cardinality', ['0:1'])
  }
});
