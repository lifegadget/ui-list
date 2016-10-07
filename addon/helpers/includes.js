import Ember from 'ember';
import Immutable from 'immutable';
const { Map, Set } = Immutable; // jshint ignore:line
const { typeOf, debug  } = Ember;

export function includes(params/*, hash*/) {
  const [ lookIn, lookFor ] = params;

  if(Set.isSet(lookIn) || Map.isMap(lookIn)) {
    return lookIn.includes(lookFor);
  }
  if(!lookIn) {
    return false;
  }

  debug(`the includes helper is only for Map and Set objects, ${typeOf(lookIn)} provided.`);
  return false;
}

export default Ember.Helper.helper(includes);
