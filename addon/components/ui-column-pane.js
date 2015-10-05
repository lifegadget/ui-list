import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

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
  value: computed('id','column', function() {
    const id = this.get('id');
    const row = this.get('row');
    return row.get(id);
  }),
  horizontal: computed.alias('column.alignment'),
  vertical: computed.alias('column.vertical'),

  aspects: computed('column',function() {
    return ['ui-cell-aspect']; // TODO: make this dynamic based on column definition
  })
});

ColumnPane[Ember.NAME_KEY] = 'Column Pane';
export default ColumnPane;
