import Ember from 'ember';
const { Mixin, computed, observer, $, A, run, on, typeOf, defineProperty, keys } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

let SharedItem = Mixin.create({  
  // Classy stuff
  classNames: ['ui-list','item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood' ],

  // Stylish stuff
  _styleDependencies: ['_componentWidth', '_componentHeight', '_windowWidth', '_windowHeight','size'],
  _style: computed('style','_styleDependencies', function() {
    let style = this.get('style');
    if (typeOf(style) === 'function') {
      run( ()=> {
        style = style(this);
      });
    }
    return !style || style === 'default' ? '' : `style-${style}`;
  }),
  _sizeDependencies: ['_componentWidth', '_componentHeight', '_windowWidth', '_windowHeight','_cpMutex'],
  _size: computed('size', '_sizeDependencies', function() {
    let size = this.get('size');
    if (typeOf(size) === 'function') {
      run( ()=> {
        size = size(this);
      });
    }    
    return !size || size === 'default' ? '' : size;
  }),
  _mood: computed('mood','title','subHeading','badge','icon','image','style', 'size', function() {
    let mood = this.get('mood');
    if (typeOf(mood) === 'function') {
      run( ()=> {
        mood = mood(this);
      });
    }
    return !mood || mood === 'default' ? '' : `mood-${mood}`;
  }),

  /**
   * Responsible for allowing the private CP's that sit as sidecars to 
   * API props which take scalars OR function callbacks. The issue at hand is
   * that scale inputs in the API are simple to handle but if a function is 
   * recieved the function itself will be dependent on an unknown set of variables 
   * in the item and the CP needs to respond to each of them.
   * 
   * The strategy for doing this is to combine all aspectPanes which are set to non-null values
   * at construction, and then whatever properties are contained in _itemCoreProperties, _itemMetaProperties,
   * and finally all _cpProperties. These properties are setup as an 
   * mutex observer which signals change to the CP. From the perspective of the CP, it is only necessary
   * to watch the mutex property for changes.
   */
  _cpInitialisation: on('init', function() {
    const props = this.get('_cpProperties'); // jshint ignore:line
    const aspectPanes = this.get('packed') ? keys(this.get('packed')) : this.get('_coreAspects'); // jshint ignore:line
    
    // TODO: implement
  }),
  _cpProperties: ['style','mood','size'],

  // Convenience Aliases and Defaults
  mood: 'default',
  style: 'default',
  size: 'default',
  skin: computed.alias('style'),
  color: computed.alias('mood'),
  
  // Initialize "Dereferenced Computed Properties"
	// ---------------------------------------------
	// NOTE: 'map' is a dereferenced hash of mappings; an item can use either a map or individual property assignments
	// of the variety item.fooMap = 'mappedTo'; 
  _defineAspectMappings: on('init', observer('_aspects','_panes','map', function() {
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
    aspects.forEach( aspect => {
      if(this.getMap(aspect)) {
        let cp = computed.readOnly(this.getMap(aspect));
        defineProperty(this, aspect, cp);
			}
      // iterate through Panes
      panes.forEach( pane => {
        if(this.getMap(aspect,pane)) {
          let cp = computed.readOnly(this, this.getMap(aspect,pane));
          defineProperty(this, aspect + capitalize(pane), cp);
        }
      });
    });
  })),
	// looks in both the map property directly off the item as well as the dereferenced
	// map hash that may also contain the property. If both are defined the locally defined 
	// map takes precedence
	getMap: function(property, pane) {
		pane = pane ? capitalize(pane) : '';
		property = property + pane;
    return this.get(`map${capitalize(property)}`) || this.get(`map.${property}`);
	},
  
  // Default Values
  _setDefaultValues: on('didInsertElement', computed('items.[]', 'items.@each._propertyChanged', function() {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    aspects.forEach( aspect => {
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
});

SharedItem[Ember.NAME_KEY] = 'Item Mixin';
export default SharedItem;