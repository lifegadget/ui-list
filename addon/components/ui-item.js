import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, A, run, on } = Ember;  // jshint ignore:line
const { typeOf, debug, defineProperty, isPresent } = Ember;  // jshint ignore:line
const { get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line

import layout from '../templates/components/ui-item';
import SharedItem from 'ui-list/mixins/shared-item-mixin';
import HeritableProperties from 'ui-list/mixins/heritable-properties'; // props which list can override
import Stylist from 'ember-cli-stylist/mixins/shared-stylist';
import NodeMessenger from '../mixins/node-messenger';
import FlexHelper from '../mixins/flex-helper';

var UiItem = Ember.Component.extend(FlexHelper,SharedItem,HeritableProperties,Stylist,NodeMessenger,{
  // Item Meta
  layout: layout,
  type: 'ui-item',
  tagName: 'div',
  disabled: false,
  selected: false,
  _aspects: ['title','subHeading','icon','image','badge'],
  _panes: ['left','center', 'right'],
  _parentalProperty: 'list',
  _componentType: 'item',
  _componentNameProperty: 'title',

  // Defaulting panes for various Aspects
  paneAliases: {
    icon: 'iconLeft',
    badge: 'badgeRight',
    image: 'imageLeft',
    title: 'titleCenter',
    subHeading: 'subHeadingCenter'
  },
  titleExists: computed.notEmpty('title'),
  subHeadingExists: computed.notEmpty('subHeading'),
  hasSubHeading: computed.and('titleExists','subHeadingExists'),

  mouseEnter(e) {
    this._tellAncestors('onHover', {
      granularity: 'item',
      state: true,
      eventSource: 'mouse-enter',
      originatedBy: this,
      event: e
    });
  },
  mouseLeave(e) {
    this._tellAncestors('onHover', {
      granularity: 'item',
      state: false,
      eventSource: 'mouse-leave',
      originatedBy: this,
      event: e
    });
  },
  /**
   * Receivers for node-messenger messages
   */
  _messages: {
    /**
     * Collect all clicks from sibliings and add context to the curry up to ui-list
     * @param  {object} originator The component which originated the click event
     * @param  {object} options    Hash of additional context
     * @return {boolean}           returns false to block the bubbling of the original event
     */
    onClick() {
      return { item: this, itemTitle: this.get('title'), itemValue: this.get('value') };
    }
  }

});

export default UiItem;
