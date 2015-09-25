import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/ui-aspect';
import NodeMessenger from '../mixins/node-messenger';

export default Ember.Component.extend(NodeMessenger,{
  layout: layout,
  classNames: ['aspect'],
  _parentalProperty: 'pane',
  _componentType: 'aspect',
  mouseDown(evt) {
    this._propagateEvent('onClick','mouseDown',evt);
  },
  touchStart(evt) {
    this._propagateEvent('onClick','touchStart',evt);
  },
  focusIn(evt) {
   this._propagateEvent('onHover','focusIn',evt);
  },
  focusOut(evt) {
    this._propagateEvent('onHover','focusOut',evt);
  },

  eventsPropagated: ['mouseDown','touchStart','focusIn','focusOut'],
  _propagateEvent(category, source, evt) {
    console.log('category: %s, evt: %o', category,evt);
    let eventsPropagated = new A(this.get('eventsPropagated'));
    if(eventsPropagated.contains(source)) {
      this._tellAncestors(category, {
        evt: evt,
        source: source,
        aspect: this,
        aspectName: get(this, 'name'),
        pane: this.pane,
        paneName: get(this,'pane.name')
      });
    }
  }
});
