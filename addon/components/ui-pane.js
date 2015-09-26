import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty } = Ember; // jshint ignore:line

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
  onClick() {
    return { pane: this, paneName: get(this,'name') };
  },

  eventsPropagated: ['mouse-down','touch-start','focus-in','focus-out'],
  _propagateEvent(category, eventSource, evt) {
    evt.preventDefault();
    evt.stopPropagation();

    // console.log('PANE category: %s, source: %s this: %o', category,eventSource, this.toString());
    let eventsPropagated = new A(this.get('eventsPropagated'));
    if(eventsPropagated.contains(eventSource)) {
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
