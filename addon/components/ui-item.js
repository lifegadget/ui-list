import Ember from 'ember';
const { Component, computed, observer, $, A, run, on, inject } = Ember;    // jshint ignore:line

import layout from '../templates/components/ui-item';
import SharedItem from 'ui-list/mixins/shared-item-mixin';

var UiItem = Component.extend(SharedItem,{
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
  twoLinedMessage: computed.and('titleExists','subHeadingExists'),

  // actions
  actions: {
    paneClick: function(pane) {
      this._tellList('paneClick', {pane: pane});
    }
  }

});

export default UiItem;
