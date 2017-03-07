import Ember from 'ember';
const { keys, create } = Object;  
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;   


export default Ember.Mixin.create({
  classNameBindings: ['_orient','_horizontal', '_vertical'],
  orient: null,
  _orient: computed('orient', function() {
    let orient = this.get('orient') || 'horizontal';
    return orient ? `orient-${orient}` : null;
  }),
  horizontal: null,
  _horizontal: computed('horizontal', function(){
    const horizontal = this.get('horizontal');
    return horizontal ? `h-${horizontal}` : null;
  }),
  vertical: 'center',
  _vertical: computed('vertical', function(){
    const vertical = this.get('vertical');
    return vertical ? `v-${vertical}` : null;
  }),
});
