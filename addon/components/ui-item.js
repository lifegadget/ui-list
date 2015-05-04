import Ember from 'ember';
const { computed, observer, $, A, run } = Ember;    // jshint ignore:line
import layout from '../templates/components/ui-item';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-list', 'item'],
  classNameBindings: ['size'],
  tagName: 'div',
  iconRight: 'chevron-right',
  iconLeft: computed.alias('icon'),
  badge: computed.alias('badgeRight'),
  
  leftPaneExists: computed.or('iconLeft','titleLeft','badgeLeft'),
  twoLinedMessage: computed.and('title','subHeading')
});
