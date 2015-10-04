import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/ui-cell-aspect';
import Aspect from 'ui-list/components/ui-aspect';

export default Aspect.extend({
  layout: layout,
  classNames: ['cell'],
  classNameBindings: ['_type','_isNegative','_isZero','_isEmpty'],
  column: computed.alias('pane'),
  precision: computed.alias('column.column.precision'),

  _type: computed('type', function() {
    return `${this.get('type')}-type`;
  }),
  _isNegative: computed('value', function() {
    const {value,type} = this.getProperties('value', 'type');
    return type==='number' && value < 0 ? 'negative' : null;
  }),
  _isZero: computed('value', function() {
    const {value,type} = this.getProperties('value', 'type');
    return type==='number' && value === 0 ? 'zero' : null;
  }),
  _isEmpty: computed('value', function() {
    const {value} = this.getProperties('value');
    return isEmpty(value) ? 'empty' : null;
  }),
  _value: computed('value', function() {
    const {precision,type} = this.getProperties('precision', 'type');
    let value = this.get('value');
    if(type === 'number' && precision) {
      value = value ? value.toFixed(precision) : value;
    }

    return value;
  })

});
