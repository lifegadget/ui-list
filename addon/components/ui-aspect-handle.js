import Ember from 'ember';
import layout from '../templates/components/ui-aspect-handle';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'span',
  classNames: ['ui-aspect-handle','no-select'],
  value: null,
  mouseDown: function(event) {
    this.sendAction('onMouseDown', event);
  },
  touchStart: function(event) {
    this.sendAction('onTouchStart', event);
  }
});
