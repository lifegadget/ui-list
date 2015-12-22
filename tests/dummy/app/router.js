import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  // LIST
  this.route('demo-list');
  this.route('demo-selectable-list');
  this.route('demo-nav-list', function() {
    this.route('simple');
    this.route('styling');
    this.route('advanced');
    this.route('actions');
  });

  this.route('demo-sortable-list');
  this.route('demo-tabular-list');

  // ITEM
  this.route('demo-item');
  this.route('demo-actionable-item');
  this.route('demo-tabular-item');
  this.route('demo-sortable-item');
  this.route('demo-row-item');

  // PANE
  this.route('demo-pane');
  this.route('demo-column-pane');

  // ASPECTS
  this.route('demo-aspect');
  this.route('ui-icon-aspect');
  this.route('ui-aspect-action-bar');
  this.route('ui-aspect-timer');
  this.route('demo-aspect-handle');

  this.route('not-implemented', {path: '/*badurl'});
});
