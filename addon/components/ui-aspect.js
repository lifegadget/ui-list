import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/ui-aspect';
import NodeMessenger from '../mixins/node-messenger';

export default Ember.Component.extend(NodeMessenger,{
  layout: layout,
  classNames: ['aspect'],
  _parentalProperty: 'pane',
  _componentType:'aspect',
  mouseDown(evt) {
    this._tellAncestors('aspect-click', {
      evt: evt,
      source: 'mouse',
      aspect: this,
      aspectName: get(this, 'name'),
      pane: this.pane,
      paneName: get(this,'pane.name')
    });
  },
  touchStart(evt) {
    this._tellAncestors('aspect-click', {
      evt: evt,
      source: 'touch',
      aspect: this,
      aspectName: get(this, 'name'),
      pane: this.pane,
      paneName: get(this,'pane.name')
    });
  },
  focusIn(evt) {
    this._tellAncestors('aspect-focus-in', {
      evt: evt,
      aspect: this,
      aspectName: get(this, 'name'),
      pane: this.pane,
      paneName: get(this,'pane.name')
    });
  },
  focusOut(evt) {
    this._tellAncestors('aspect-focus-out', {
      evt: evt,
      aspect: this,
      aspectName: get(this, 'name'),
      pane: this.pane,
      paneName: get(this,'pane.name')
    });
  }
});
