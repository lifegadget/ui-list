import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import layout from '../templates/components/ui-tabular-list';
import UiList from 'ui-list/components/ui-list';

export default UiList.extend({
  layout: layout,
  rows: computed.alias('items'),
  classNames: ['table'],

  header: true,
  striping: true,

  limit: null,
  offset: 0,
  _start: computed.alias('offset'),
  _stop: computed('offset', 'limit', function() {
    const {limit,offset, arrangedContent} = this.getProperties('limit','offset','arrangedContent');
    return limit ? offset + limit : arrangedContent.length;
  }),

  /**
   * Hash of functions to message up and down the list hierarchy
   */
  _messages: {
    onClick(o) {
      return { message: `clicked on the "${o.paneName}" column of the ${get(o.item,'elementId')} row` };
    },
    onChange() {
      return true;
    },
    onHover(o) {
      if(o.eventSource === 'mouse-leave') {
        return { message: `hover exited "${o.granularity}" with id of ${get(o.originatedBy,'elementId')}` };
      } else {
        return { message: `hover entered "${o.granularity}" with id of ${get(o.originatedBy,'elementId')}` };
      }
    }
  }
});
