import Ember from 'ember';

export default Ember.Route.extend({


  actions: {
    navigate(action) {
      this.transitionTo(action.id);
    }
  }
});
