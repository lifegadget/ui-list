import Ember from 'ember';
const { computed, run, on, typeOf, keys, Mixin } = Ember;    // jshint ignore:line

export default Mixin.create({
  // serves as a property to base your computed properties on
  // and as a nominal extra benefit it counts your changes (for what its worth)
  _propertyChanged: false,
  _changedProperty: null, 
  // initialize
  _initObserveAll: on('init',function() {
    keys(this).forEach( key => {
      if(typeOf(this.get(key)) !== 'function') {
        this.addObserver(key, () => {
          run.next( () => {
            this.toggleProperty('_propertyChanged');
            this.set('_changedProperty', key);
          });
        });
      }
    });
  })
});
