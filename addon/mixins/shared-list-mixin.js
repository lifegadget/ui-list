import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;    // jshint ignore:line

export default Ember.Mixin.create({
  
  _metaMutex: 0,
  _metaObserverReferences: new A([]),
  _metaObservers: on('didInsertElement', function() {
    const listProps = new A(this.get('_listProperties'));
    listProps.forEach( prop => {
      let refs = new A(this.get('_metaObserverReferences'));
      if(!refs.contains(prop)) {
        run.once( () => {
          this.addObserver(prop, this, this._notifyMetaChange);
          refs.push(prop);          
        });
      }
    });
  }),
  _notifyMetaChange: function() {
    this.notifyPropertyChange('_metaMutex');
  },
  _metaCleanup: on('willDestroyElement', function() {
    let refs = new A(this.get('_metaObserverReferences'));
    refs.forEach( prop => {
      this.removeObserver(prop, this, this._notifyMetaChange);
      refs.reject( item => {
        return item === prop;
      });
    });
  }),
  
});
