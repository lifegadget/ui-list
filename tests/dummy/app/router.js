import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo');
  this.route('addons');
  this.route('actions');
  this.route('related');
  this.route('skinning');
  this.route('bespoke-items');
});

export default Router;
