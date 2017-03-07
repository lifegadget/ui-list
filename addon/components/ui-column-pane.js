import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import layout from '../templates/components/ui-column-pane';
import UiPane from 'ui-list/components/ui-pane';

const ColumnPane = UiPane.extend({
  layout: layout,
  row: computed.alias('item'), // allow for a more contextual name for "item"
  classNameBindings: ['id'],
  classNames: ['column'],
  id: computed.alias('column.id'),
  name: computed.alias('column.name'),
  type: computed.alias('column.type'),
  format: computed.alias('column.format'),
  options: computed.alias('column.options'),
  value: null,
  _value: on('init', function() {
    const prop = this.get('id');
    const cp = computed.alias(`data.${prop}`);
    defineProperty(this, 'value', cp);
  }),
  horizontal: computed.alias('column.horizontal'),
  vertical: computed.alias('column.vertical'),

  aspects: computed('column',function() {
    const {type,options,buttons} = this.getProperties('type','options','buttons');
    if (type === 'buttons') {
      this.set('options', merge(options,buttons));
      return ['ui-buttons-aspect'];
    }
    else if (type === 'selection') {
      return ['ui-selection-aspect'];
    }
    else {
      return ['ui-cell-aspect'];
    }
  })
});

ColumnPane[Ember.NAME_KEY] = 'Column Pane';
export default ColumnPane;
