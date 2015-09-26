import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  // LIST
  this.route('demo-list');
  this.route('demo-selectable-list');
  this.route('demo-nav-list');
  this.route('demo-sortable-list');

  // ITEM
  this.route('demo-item');
  this.route('demo-actionable-item');
  this.route('demo-tabular-item');
  this.route('demo-sortable-item');

  // GRANULAR
  this.route('demo-pane');
  this.route('demo-aspect');
  this.route('ui-icon-aspect');
  this.route('ui-aspect-action-bar');
  this.route('ui-aspect-timer');
  this.route('demo-aspect-handle');

  this.route('not-implemented', {path: '/*badurl'});
});
