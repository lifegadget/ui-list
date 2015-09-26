import Ember from 'ember';

export function ifThenElse([param, ifTrue, ifFalse]) {
  return param ? ifTrue : ifFalse || null;
}

export default Ember.Helper.helper(ifThenElse);
