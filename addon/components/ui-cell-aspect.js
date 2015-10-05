import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/ui-cell-aspect';
import Aspect from 'ui-list/components/ui-aspect';
import moment from 'moment';
import momentDuration from 'ember-moment/computeds/duration';
import momentFormat from 'ember-moment/computeds/format';
import momentFromNow from 'ember-moment/computeds/from-now';
import momentToNow from 'ember-moment/computeds/to-now';

export default Aspect.extend({
  layout: layout,
  classNames: ['cell'],
  classNameBindings: ['_type','_isNegative','_isZero','_isEmpty'],
  column: computed.alias('pane'),
  value: computed.alias('column.value'),
  type: computed.alias('column.column.type'),
  precision: computed.alias('column.column.precision'),
  format: computed.alias('column.column.format'),

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
    const {precision,type,format} = this.getProperties('precision', 'type', 'format');
    let value = this.get('value');
    // Numbers
    if(type === 'number' && precision) {
      value = value ? value.toFixed(precision) : value;
    }
    // Dates
    else if(type === 'date') {
      switch(format) {
        case 'toNow':
          value = moment(value).fromNow();
          break;
        case 'fromNow':
          value = moment(value).toNow();
          break;
        case 'time':
          value = moment(value).format('H:mm:ss');
          break;
        case 'date-us':
          value = moment(value).format('MMM Do, YYYY');
          break;
        case 'date-uk':
          value = moment(value).format('D MMM, YYYY');
          break;
      }
    }

    return value;
  })

});
