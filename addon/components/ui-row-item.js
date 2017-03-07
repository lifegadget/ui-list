import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  
const camelize = thingy => {
  return thingy ? Ember.String.camelize(thingy) : thingy;
};
import layout from '../templates/components/ui-row-item';
import UiItem from 'ui-list/components/ui-item';

export default UiItem.extend({
  layout: layout,
  classNames: ['row'],
  skin: 'flat',
  /**
   * Looks for configuration passed in but if not found then produces generic configuration
   * based on the keys available in 'attrs'
   */
  _columns: computed('attrs.columns','columns.isFulfilled', function() {
    let columns = this.get('columns'); // column definition
    const defaultConfig = {
      type: 'string',
      horizontal: 'left',
      vertical: 'top',
      growth: 1,
      shrink: 1
    };

    // convert CSV string to array with default props
    if(typeOf(columns) === 'string') {
      columns = columns.split(',');
      columns = columns.map(prop => {
        return {
          id: camelize(prop),
          name: prop
        };
      });
    }
    // no configuration found, use passed in attrs
    else if(!columns) {
      const ignore = a(['skin','size','columns','list','table']);
      const props = keys(this.get('attrs')).filter(item=>!ignore.includes(item));
      columns = props.map(prop => {
        return {
          id: camelize(prop),
          name: prop
        };
      });
    }

    // return array structure
    if(typeOf(columns) === 'array') {
      return columns.map(item => {
        if(typeOf(item) === 'string') {
          item = {id: camelize(item), name: item};
        }
        keys(defaultConfig).map(prop => {
          if(!get(item,prop)) {
            item[prop] = defaultConfig[prop];
          }
        });
        return item;
      });
    }
    // reject other structures
    else {
      debug(`could not determine column definition for row[${this.get('elementId')}]`);
      return [];
    }
  }),
  unpack: computed('_columns', function() {
    const data = this.get('data');
    return data ? this.get('_columns').map(item => get(item,'id')) : [];
  })
});
