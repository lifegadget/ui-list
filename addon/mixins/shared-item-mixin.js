import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, defineProperty } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

export default Ember.Mixin.create({
  
  // Classy stuff
  classNames: ['ui-list','item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood' ],
  // Stylish stuff
  _style: on('init', computed('style', function() {
    let style = this.get('style');
    return !style || style === 'default' ? '' : `style-${style}`;
  })),
  _size: on('init', computed('size', function() {
    let size = this.get('size');
    return !size || size === 'default' ? '' : size;
  })),
  _mood: on('init', computed('mood', function() {
    let mood = this.get('mood');
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  })),
  // Convenience Aliases and Defaults
  mood: 'default',
  style: 'default',
  size: 'default',
  skin: computed.alias('style'),
  color: computed.alias('mood'),
  
  // Initialize "Dereferenced Computed Properties"
  _defineAspectMappings: on('init', computed('aspects','panes', () => {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    _aspects.forEach( aspect => {
      const mapProp = 'define' + capitalize(aspect);
      if(this.get(mapProp)) {
        let cp = computed.readOnly(mapProp);
        defineProperty(this, aspect, cp);
        // iterate through Panes
        panes.forEach( pane => {
          const paneMapProp = mapProp + capitalize(pane);
          if(this.get('paneMapProp')) {
            cp = computed.readOnly(this, paneMapProp);
            defineProperty(this, aspect + capitalize(pane), cp);
          }
        })
      }
    });
  })), // aspect mappings
  
  // Default Values
  _setDefaultValues: on('didInsertElement', computed('items.[]', 'items.@each._propertyChanged', function() {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    _aspects.forEach( aspect => {
      const propValue = this.get('aspect');
      if(!propValue) {
        this.set(aspect,propValue);
      }
      panes.forEach( pane => {
        const prop = aspect + capitalize(pane);
        const propValue = this.get(prop);
        if(!propValue) {
          this.set(prop,propValue);
        }
      });
    });
  })) // end default value
})

