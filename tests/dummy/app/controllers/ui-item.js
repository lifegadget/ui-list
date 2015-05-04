import Ember from 'ember';
const { computed, observer, $, A, run, on } = Ember;    // jshint ignore:line

export default Ember.Controller.extend({

  toggledBadge: on('init',computed('showBadge', function() {
    return this.get('showBadge') ? 4 : null;
  })),
  showBadge: true,
  showIcon: true,
  showSubHeading: true,
  toggledIcon: on('init',computed('showIcon', function() {
    return this.get('showIcon') ? 'envelope' : null;
  })),
  toggledSubHeading: on('init',computed('showSubHeading', function() {
    return this.get('showSubHeading') ? 'ran 12mi in London' : null;
  })),
  size: 'normal',
  

});