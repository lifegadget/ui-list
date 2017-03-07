import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import layout from '../templates/components/ui-pagination-control';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-pagination'],
  _parentalProperty: 'list',
  _componentType: 'control',
  _componentNameProperty: 'pagination-control',

  limit: computed.alias('list.limit'),
  offset: computed.alias('list.offset'),
  page: computed('offset', function() {
    const {offset,limit} = this.getProperties('offset','limit');
    return offset / limit === parseInt(offset / limit,10) ? (offset/limit) + 1: Math.floor(offset/limit) + 2;
  }),
  pages: computed('offset','list.items.length',function() {
    const {limit} = this.getProperties('limit');
    const size = this.get('list.items.length');
    return size / limit ===  parseInt(size / limit, 10) ? size/limit : size/limit + 1;
  }),
  pageUpNav: computed('pages','page', function() {
    const {pages,page} = this.getProperties('pages', 'page');
    return page >= pages ? 'no-upward-paging' : 'upward-paging';
  }),
  pageDownNav: computed('pages','page', function() {
    const {page} = this.getProperties('page');
    return page <= 1 ? 'no-downward-paging' : 'downward-paging';
  }),
  sortedByMessage: computed('list.sort', function() {
    const sortedBy = this.get('list.sort');
    const column = a(this.get('list.columns')).findBy('id', sortedBy);
    return sortedBy ? `, sorted by ${column.name}` : '';
  }),

  actions: {
    pageUp() {
      const {page,pages,limit} = this.getProperties('page','pages','limit');
      if(page === pages) {
        this.list.sendAction('onError', {
          'code': 'paginationation-constraint',
          'subCode': 'exceeded',
          'message': 'Attempted to paginated upward but already on the last page'
        });
      } else {
        let newOffset = (limit * page);
        this.set('list.offset', newOffset);
      }
    },
    pageDown() {
      const {page,limit} = this.getProperties('page','limit');
      if(page === 1) {
        this.list.sendAction('onError', {
          'code': 'paginationation-constraint',
          'subCode': 'below-one',
          'message': 'Attempted to paginated downward but already on first page'
        });
      } else {
        let newOffset = limit * (page - 2);
        this.set('list.offset', newOffset);
      }
    }
  }
});
