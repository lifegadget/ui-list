import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-list';
import UiSelectableList from '../components/ui-selectable-list';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default UiSelectableList.extend({
  layout: layout,
  classNames: ['ui-nav-list'],
  classNameBindings: ['position', 'horizontal'],
  min: 1,
  max: 1,
  cardinality: '1:1',
  skin: 'nav',
  iconRight: '',
  position: 'left',
  horizontal: computed('position', function() {
    const position = this.get('position');
    return new A(['top','bottom']).contains(position) ? true : false;
  })
});
