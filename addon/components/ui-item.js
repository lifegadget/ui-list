import Ember from 'ember';
const { Component, computed, observer, $, A, run, on } = Ember;    // jshint ignore:line

import layout from '../templates/components/ui-item';
import SharedItem from 'ui-list/mixins/shared-item-mixin';

export default Component.extend(SharedItem,{
  // Item Meta
  layout: layout,
  tagName: 'div',
  disabled: false,
  iconRight: 'chevron-right',
  _aspects: new A(['title','subHeading','icon','image','actionIcon']),
  _panes: new A(['left','center', 'right']),
  // Defaulting panes for various Aspects
  iconLeft: computed.alias('icon'),
  badge: computed.alias('badgeRight'),
  
  leftPaneExists: computed.or('iconLeft','titleLeft','badgeLeft'),
  titleExists: computed.notEmpty('title'),
  subHeadingExists: computed.notEmpty('subHeading'),
  twoLinedMessage: computed.and('titleExists','subHeadingExists')
});
