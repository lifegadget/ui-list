import Ember from 'ember';
const { Component, computed, observer, $, A, run, on, inject } = Ember;    // jshint ignore:line


import layout from '../templates/components/ui-item';
import SharedItem from 'ui-list/mixins/shared-item-mixin';

export default Component.extend(SharedItem,{
  // Item Meta
  layout: layout,
  tagName: 'div',
  disabled: false,
  iconRight: 'chevron-right',
  _aspects: ['title','subHeading','icon','image'],
  _panes: ['left','center', 'right'],
  // Defaulting panes for various Aspects
  icon: computed.alias('iconLeft'),
  badge: computed.alias('badgeRight'),
  image: computed.alias('imageLeft'),
  
  leftPaneExists: computed.or('iconLeft','titleLeft','badgeLeft'),
  titleExists: computed.notEmpty('title'),
  subHeadingExists: computed.notEmpty('subHeading'),
  twoLinedMessage: computed.and('titleExists','subHeadingExists'),
  
  responsive: inject.service()
});
