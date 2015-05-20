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
  iconRight: 'chevron-right',
  _aspects: ['title','subHeading','icon','image','badge'],
  _panes: ['left','center', 'right'],
  // Defaulting panes for various Aspects
  icon: computed.alias('iconLeft'),
  badge: computed.alias('badgeRight'),
  image: computed.alias('imageLeft'),
  title: computed.alias('titleCenter'),
  subHeading: computed.alias('subHeadingCenter'),
  
  titleExists: computed.notEmpty('title'),
  subHeadingExists: computed.notEmpty('subHeading'),
  twoLinedMessage: computed.and('titleExists','subHeadingExists'),
  
  responsive: inject.service()
});

UiItem[Ember.NAME_KEY] = 'ui-item';
export default UiItem;