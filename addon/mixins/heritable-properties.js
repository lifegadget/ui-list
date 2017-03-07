import Ember from 'ember';
const { keys, create } = Object;  
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;   

/**
 * This mixin manages those properties which are owned by "items"
 * but will seed responsibility to the "list" once registered.
 *
 * Several of these properties can either take on a direct value or
 * instead be a function which is executed when their context is changed.
 * In cases where a function is present, the "sensitivities" for the property represent properties which
 * which may impact the functions output and therefore must be added as a observable property.
 */
const observedProperties = ['skin', 'size', 'mood', 'squeezed'];
const HeritableProperties = Ember.Mixin.create({
  classNameBindings: ['_size','_disabled:disabled:enabled','_mood','squeezed','_skin'],

  // SKIN
  skin: 'default',
  _skin: computed('skin', 'list.skin', '_skinMutex', function() {
    const listSkin = this.get('list.skin');
    let skin = listSkin ? listSkin : this.get('skin');
    if (typeOf(skin) === 'function') {
      run( ()=> {
        skin = skin(this);
      });
    }
    return !skin || skin === 'default' ? '' : `skin-${skin}`;
  }),
  // MOOD
  size: 'default',
  _size: computed('size', 'list.size','_sizeMutex', function() {
    let listSize = this.get('list.size');
    let size = listSize ? listSize : this.get('size');
    if (typeOf(size) === 'function') {
      run( ()=> {
        size = size(this);
      });
    }
    return !size || size === 'default' ? '' : size;
  }),
  // MOOD
  mood: 'default',
  _mood: computed('mood','list.mood', '_moodMutex', function() {
    let listMood = get(this,'list.mood');
    let mood = listMood ? listMood : this.get('mood');
    if (typeOf(mood) === 'function') {
      run( ()=> {
        mood = mood(this);
      });
    }
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  }),
  // SQUEEZED
  squeezed: false,
  _squeezed: computed('squeezed', 'list.squeezed', '_squeezeMutex', function() {
    const _squeezed = this.get('squeezed');
    const listSqueezed = this.get('list.squeezed');
    return new A(['null','undefined']).includes(typeOf(listSqueezed)) ? listSqueezed : _squeezed;
  }),

  // DISABLED
  disabled: false,
  _disabled: computed('disabled', 'list.disabled', '_disabledMutex', function() {
    const disabled = this.get('disabled');
    const listdisabled = this.get('list.disabled');
    return new A(['null','undefined']).includes(typeOf(listdisabled)) ? disabled : listdisabled;
  }),

  // DYNAMIC OBSERVATION
  _defaultSensitivities: ['title', 'subHeading', 'mood', 'badge'],
  initiateDynamicObservers: on('didInitAttrs', function() {
    this._dynObservers = {};
    new A(observedProperties).map(prop => {
      this._dynObservers[prop] = new A([]);
      const propType = typeOf(this.get(prop));
      if(propType === 'function') {
        this.addSensitivityObservers(prop);
      }
    });
  }),
  destroyDynamicObservers: on('willDestroyElement', function() {
    observedProperties.map(op => {
      this.removeSensitivityObservers(op);
    });
  }),
  addSensitivityObservers(property) {
    const propSensitivities = this.get(`${property}Sensativities`);
    const defaultSensitivities = this.get('_defaultSensitivities').filter(i => { return i !== property;});
    const observeredProperties = propSensitivities ? propSensitivities : defaultSensitivities;
    const mutexProp = `_${property}Mutex`;
    observeredProperties.map( op => {
      let mutex = () => {
        this.notifyPropertyChange(mutexProp);
      };
      this._dynObservers[property].pushObject({property: op, mutex: mutex});
      this.addObserver(op, mutex);
    });
  },
  removeSensitivityObservers(property) {
    const observedProperties = this._dynObservers[property];
    run.next(()=> {
      observedProperties.map( op => {
        this.removeObserver(op.property, this, op.mutex);
      });
    });
  }

});

HeritableProperties[Ember.NAME_KEY] = 'Heritable Properties';
export default HeritableProperties;
