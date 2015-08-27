import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import layout from '../templates/components/ui-item';
import SharedItem from 'ui-list/mixins/shared-item-mixin';
import HeritableProperties from 'ui-list/mixins/heritable-properties'; // props which list can override

var UiItem = Ember.Component.extend(SharedItem,HeritableProperties,{
  // Item Meta
  layout: layout,
  type: 'ui-item',
  tagName: 'div',
  disabled: false,
  selected: false,
  iconRight: 'chevron-right',
  _aspects: ['title','subHeading','icon','image','badge'],
  _panes: ['left','center', 'right'],
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

  // actions
  actions: {
    paneClick: function(pane) {
      this._tellList('paneClick', this, {pane: pane});
    }
  }

});

export default UiItem;
