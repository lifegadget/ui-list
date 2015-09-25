import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
import layout from '../templates/components/ui-pane';
const dasherize = thingy => {
  return thingy ? Ember.String.dasherize(thingy) : thingy;
};
import NodeMessenger from '../mixins/node-messenger';

export default Ember.Component.extend(NodeMessenger,{
  layout: layout,
  tagName: 'div',
  classNames: ['pane'],
  classNameBindings: ['_orient','_horizontal', '_vertical','_name','isEmpty:empty:filled'],
  _parentalProperty: 'item',
  _componentType: 'pane',

  name: null,
  _name: computed('name', function() {
    const name = dasherize(this.get('name'));
    return name ? `${name}-pane` : null;
  }),
  orient: null,
  _orient: computed('orient', function() {
    let orient = this.get('orient') || 'horizontal';
    return orient ? `orient-${orient}` : null;
  }),
  horizontal: null,
  _horizontal: computed('horizontal', function(){
    const horizontal = this.get('horizontal');
    return horizontal ? `h-${horizontal}` : null;
  }),
  vertical: 'center',
  _vertical: computed('vertical', function(){
    const vertical = this.get('vertical');
    return vertical ? `v-${vertical}` : null;
  }),

});
