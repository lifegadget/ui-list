import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  // LIST
  this.route('ui-list');
  
  
  // ITEM
  this.route('ui-item');
  this.route('ui-actionable-item');
  this.route('ui-tabular-item');
  
  // HELPER
  this.route('ui-aspect-action-bar');
  this.route('ui-aspect-timer');
  this.route('ui-aspect-handle');
  
  this.resource('not-implemented', {path: '/*badurl'});
});
