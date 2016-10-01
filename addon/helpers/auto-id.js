import Ember from 'ember';

export function autoId(params) {
  return Math.random().toString(36).substr(2, params[0] || 10);
}

export default Ember.Helper.helper(autoId);
