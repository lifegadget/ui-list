import Ember from 'ember';

export default Ember.Controller.extend({

  isRepressed: false,
  toggledEnablement: false, 
  isIndexPage: Ember.computed.equal('currentPath', 'index'),
  notIndexPage: Ember.computed.not('isIndexPage'),
  
  actions: {
    toggleRepression: function() {
      this.toggleProperty('isRepressed');
    },
    toggleEnablement: function() {
      this.toggleProperty('toggledEnablement');
    }
  }

});