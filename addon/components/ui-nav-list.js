import Ember from 'ember';   
import layout from '../templates/components/ui-list';
import UiSelectableList from '../components/ui-selectable-list';
const { keys, create } = Object;  
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;   

export default UiSelectableList.extend({
  layout: layout,
  classNames: ['ui-nav-list'],
  classNameBindings: ['position', 'horizontal'],
  min: 1,
  max: 1,
  gaps: 0, // space between nav items
  padEnds: 0, // space on both ends

  cardinality: '1:1',
  skin: 'nav',
  iconRight: '',
  position: 'left',
  horizontal: computed('position', function() {
    const position = this.get('position');
    return new A(['top','bottom']).includes(position) ? true : false;
  }),

});
