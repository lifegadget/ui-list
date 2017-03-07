import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import layout from '../templates/components/ui-cell-aspect';
import Aspect from 'ui-list/components/ui-aspect';
import moment from 'moment';

export default Aspect.extend({
  layout: layout,
  classNames: ['cell'],
  classNameBindings: ['_type','_isNegative','_isZero','_isEmpty','_classy'],
  column: computed.alias('pane'),
  value: computed.alias('column.value'),
  type: computed.alias('column.column.type'),
  precision: computed.alias('column.column.precision'),
  format: computed.alias('column.column.format'),
  classy: computed.alias('column.column.class'),
  _classy: computed('classy',function() {
    const {classy,value} = this.getProperties('classy','value');
    const type = typeOf(classy);
    switch(type) {
      case 'function':
        return classy(this);
      case 'object':
        return classy[value] ? classy[value] : null;
      case 'boolean':
        return classy ? value : null;
    }
  }),
  empty: computed.alias('column.column.empty'),

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
    const {precision,type,format,empty,_isEmpty} = this.getProperties('precision', 'type', 'format','empty','_isEmpty');
    let value = this.get('value');
    if(_isEmpty && empty) {
      return empty;
    }
    // Numbers
    if(type === 'number' && precision) {
      value = value ? value.toFixed(precision) : value;
    }
    // Dates
    else if(type === 'date') {
      if(!value) {
        return empty ? empty : null;
      }
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

        default:
          value = moment(value).format(format);
      }
    }

    return value;
  })
});
