import Ember from 'ember';
const { computed, run, on, typeOf, keys, Mixin } = Ember;    // jshint ignore:line

var ObserveAll =  Mixin.create({
  // serves as a property to base your computed properties on
  // and as a nominal extra benefit it counts your changes (for what its worth)
  _propertyChanged: false,
  _changedProperty: null, 
  _propertyChangedCallback: null,
  // initialize
  _initObserveAll: on('init',function() {
    let callback = this.get('_propertyChangedCallback');
    return this.observeAll(this, callback);
  }),
  
  /**
   * Adds observers to all properties of an external object (ignoring those starting with '_'); and takes the following actions:
   * 1. Toggles the '_propertyChanged' so observers/CP can monitor this
   * 2. Sets the 'key' that changes to the '_propertyChanged' (note: this is fairly transient so mileage may vary)
   * 3. Provides a callback hook which is called if available
   */
  observeAll: function(object, callback) {
    if(!object.addObserver) {
      console.info('An object passed into addObservers() is not "observer aware"; object observers will not be setup: %o', object);
      return false;
    }
    // iterate properties of sent in object 
    keys(object).forEach( key => {
      let objectKey = object.get(key);
      if(typeOf(objectKey) !== 'function' && key.substr(0,1) !== '_') {
        object.set('_propertyChanged',false);
        object.addObserver(key, () => {
          run.next( () => {
            object.toggleProperty('_propertyChanged');
            object.set('_changedProperty', key);
            if(callback) {
              callback(key);
            }            
          })
        });
      }
    });    
  }
});

ObserveAll[Ember.NAME_KEY] = 'ObserveAll Mixin';
export default ObserveAll; 