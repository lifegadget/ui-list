import Ember from 'ember';

export function includes(params/*, hash*/) {
  return Ember.A(params[0]).includes(params[1]);
}

export default Ember.Helper.helper(includes);
