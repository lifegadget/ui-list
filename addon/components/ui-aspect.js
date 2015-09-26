import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty } = Ember; // jshint ignore:line
import layout from '../templates/components/ui-aspect';
import NodeMessenger from '../mixins/node-messenger';

export default Ember.Component.extend(NodeMessenger,{
  layout: layout,
  tagName: 'span',
  classNames: ['aspect'],
  classNameBindings: ['aspectType'],
  _parentalProperty: 'pane',
  _componentType: 'aspect',
  _componentNameProperty: 'aspectType',

  mouseDown(evt) {
    this._propagateEvent('onClick','mouse-down',evt);
  },
  touchStart(evt) {
    this._propagateEvent('onClick','touch-start',evt);
  },
  mouseEnter(evt) {
   this._propagateEvent('onHover','mouse-enter',evt);
  },
  mouseLeave(evt) {
    this._propagateEvent('onHover','mouse-leave',evt);
  },

  onClick() {
    return { aspect: this, aspectName: this.get('name')};
  },

  eventsPropagated: ['mouse-down','touch-start','focus-in','focus-out'],
  _propagateEvent(msg, eventSource, evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let eventsPropagated = new A(this.get('eventsPropagated'));
    if(eventsPropagated.contains(eventSource)) {
      this._tellAncestors(msg, {
        evt: evt,
        eventSource: eventSource,
        granularity: this.get('_componentType'),
        aspect: this,
        aspectName: get(this, 'name'),
      });
    }
  }
});
