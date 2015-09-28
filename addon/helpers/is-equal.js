import Ember from 'ember';

export function isEqual([arg1, arg2]) {
  return arg1 === arg2;
}

export default Ember.HTMLBars.makeBoundHelper(isEqual);
