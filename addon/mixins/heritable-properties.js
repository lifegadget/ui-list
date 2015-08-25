import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line


const HeritableProperties = Ember.Mixin.create({
  classNameBindings: ['_size','_disabled:disabled:enabled','_mood','squeezed','_skin'],

  // SKIN
  skin: 'default',
  _skin: computed('skin', 'list.skin', function() {
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
  _size: computed('size', 'title','responsive.mutex', function() {
    let size = this.get('size');
    if (typeOf(size) === 'function') {
      run( ()=> {
        size = size(this);
      });
    }
    return !size || size === 'default' ? '' : size;
  }),
  // MOOD
  mood: 'default',
  _mood: computed('mood','title','subHeading','badge','icon','image','skin', 'size', function() {
    let mood = this.get('mood');
    if (typeOf(mood) === 'function') {
      run( ()=> {
        mood = mood(this);
      });
    }
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  }),
  // SQUEEZED
  squeezed: false,
  _squeezed: computed('squeezed', 'list.squeezed', function() {
    const _squeezed = this.get('squeezed');
    const listSqueezed = this.get('list.squeezed');
    return new A(['null','undefined']).contains(typeOf(listSqueezed)) ? listSqueezed : _squeezed;
  })


});

HeritableProperties[Ember.NAME_KEY] = 'Item Props with List Overides';
export default HeritableProperties;
