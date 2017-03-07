import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import layout from '../templates/components/ui-sort-control';
import NodeMessenger from 'ui-list/mixins/node-messenger';

export default Ember.Component.extend(NodeMessenger,{
  layout: layout,
  classNames: ['sort-control'],
  _parentalProperty: 'list',
  _componentType: 'control',
  _componentNameProperty: 'sort-control',

  sort: computed.alias('list.sort'),
  sortDirection: computed.alias('list.sortDirection'),
  columnId: computed.alias('column.id'),

  propertySelected: computed('sort','columnId', function() {
    const {sort,columnId} = this.getProperties('sort','columnId');
    return sort === columnId;
  }),
  ascendingSelected: computed('propertySelected', 'sortDirection', function() {
    const {propertySelected,sortDirection} = this.getProperties('propertySelected', 'sortDirection');
    return propertySelected && sortDirection === 'ascending';
  }),
  descendingSelected: computed('propertySelected', 'sortDirection', function() {
    const {propertySelected,sortDirection} = this.getProperties('propertySelected', 'sortDirection');
    return propertySelected && sortDirection === 'descending';
  }),

  actions: {
    changeSort(direction) {
      const {ascendingSelected,descendingSelected,columnId} = this.getProperties('ascendingSelected', 'descendingSelected','columnId');
      let selected = direction === 'ascending' ? ascendingSelected : descendingSelected;
      if(selected) {
        this.set('list.sort', null);
        this._tellAncestors('onChange', {
          action: 'sort-changed',
          granularity: 'sort-control',
          column: columnId,
          message: `explicit sorting was removed, natural sort order has been restored`,
          sortedList: this.get('list.arrangedContent')
        });
      } else {
        this.set('list.sort', columnId);
        this.set('list.sortDirection', direction);
        this._tellAncestors('onChange', {
          action: 'sort-changed',
          granularity: 'sort-control',
          column: columnId,
          direction: direction,
          message: `sorting by "${columnId}" property (${direction})`,
          sortedList: this.get('list.arrangedContent')
        });
      }
    }
  }

});
