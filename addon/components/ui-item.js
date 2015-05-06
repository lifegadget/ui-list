import Ember from 'ember';
const { computed, observer, $, A, run, on } = Ember;    // jshint ignore:line
import layout from '../templates/components/ui-item';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['ui-list', 'item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood'],
  tagName: 'div',
  style: 'default',
  _style: on('init', computed('style', function() {
    let style = this.get('style');
    return !style || style === 'default' ? '' : `style-${style}`;
  })),
  size: 'default',
  _size: on('init', computed('size', function() {
    let size = this.get('size');
    return !size || size === 'default' ? '' : size;
  })),
  disabled: false,
  mood: 'default',
  color: computed.alias('mood'),
  _mood: on('init', computed('mood', function() {
    let mood = this.get('mood');
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  })),
  
  iconRight: 'chevron-right',
  iconLeft: computed.alias('icon'),
  badge: computed.alias('badgeRight'),
  skin: computed.alias('style'),
  
  leftPaneExists: computed.or('iconLeft','titleLeft','badgeLeft'),
  titleExists: computed.notEmpty('title'),
  subHeadingExists: computed.notEmpty('subHeading'),
  twoLinedMessage: computed.and('titleExists','subHeadingExists')
});
