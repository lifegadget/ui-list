import Ember from 'ember';

export default Ember.Route.extend({
  title: 'ui-tabular-list',

  model() {
    return this.store.findAll('appointment');
  }
});
