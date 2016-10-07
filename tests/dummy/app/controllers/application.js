import Ember from 'ember';
import navHandler from 'ui-navigation/mixins/nav-handler';

export default Ember.Controller.extend(navHandler, {

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
