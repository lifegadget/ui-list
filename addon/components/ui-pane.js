import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;   
const { defineProperty, get, set, inject, isEmpty } = Ember;  

import layout from '../templates/components/ui-pane';
const dasherize = thingy => {
  return thingy ? Ember.String.dasherize(thingy) : thingy;
};
import FlexHelper from '../mixins/flex-helper';
import NodeMessenger from '../mixins/node-messenger';

export default Ember.Component.extend(FlexHelper, NodeMessenger,{
  layout: layout,
  tagName: 'div',
  classNames: ['pane'],
  classNameBindings: ['_name'],
  _parentalProperty: 'item',
  _componentType: 'pane',

  name: null,
  _name: computed('name', function() {
    const name = dasherize(this.get('name'));
    return name ? `${name}-pane` : null;
  }),

  mouseDown(evt) {
    this._propagateEvent('onClick','mouse-down',evt);
  },
  touchStart(evt) {
    this._propagateEvent('onClick','touch-start',evt);
  },
  focusIn(evt) {
   this._propagateEvent('onHover','focus-in',evt);
  },
  focusOut(evt) {
    this._propagateEvent('onHover','focus-out',evt);
  },
  _messages: {
    onClick() {
      return { pane: this, paneName: get(this,'name') };
    }
  },
  eventsPropagated: ['mouse-down','touch-start','focus-in','focus-out'],
  _propagateEvent(category, eventSource, evt) {
    evt.preventDefault();
    evt.stopPropagation();

    let eventsPropagated = new A(this.get('eventsPropagated'));
    if(eventsPropagated.includes(eventSource)) {
      this._tellAncestors(category, {
        evt: evt,
        granularity: 'pane',
        eventSource: eventSource,
        pane: this,
        paneName: get(this,'name')
      });
    }
  }

});
