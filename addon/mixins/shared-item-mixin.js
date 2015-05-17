import Ember from 'ember';
const { Mixin, computed, observer, $, A, run, on, typeOf, defineProperty, keys } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

let SharedItem = Mixin.create({  
  // Classy stuff
  classNames: ['ui-list','item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood','squeezed' ],

  // Stylish stuff
  squeezed: false,
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
  _size: computed('size', 'title','responsive.mutex', function() {
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
   * setups up logical flags to indicate the existance of content on a per pane basis
   */
  _logicPanes: on('init', function() {
    const panes = new A(this.get('_panes'));
    const aspects = new A(this.get('_aspects'));
    // let panesSet = [];
    panes.forEach( pane => {
      const property = 'has' + capitalize(pane) + 'Pane';
      const relevantAspects = aspects.map(aspect=>{ return aspect + capitalize(pane); });
      const cp = computed.or(...relevantAspects);
      defineProperty(this,property,cp);
      this.notifyPropertyChange(property);
    });
  }),

  // Unpacking packed hash
  _unpackProperties:  on('init', function() {
    const packed = this.get('packed');
    const packedProperties = this.get('packedProperties');
    if(packed) {
      keys(packed).forEach( key => {
        this.set(key, packed[key]);
      });
      this.set('_keyAspectPanes', packedProperties ? packedProperties : new A(keys(packed))); 
    } else {
      const aspectPanes = this.get('_aspectPanes'); // get full list supported by this item type
      let keyAspectPanes = new A([]);
      new A(aspectPanes).filter( item => {
        if(this[item]) {
          keyAspectPanes.push(item);
        }
      });
      this.set('_keyAspectPanes', keyAspectPanes);
    }
  }), 
  
  /**
   * The specific Item components should define which aspects and panes they support, this 
   * just bring together the resultant array of aspectPanes which can be targetted/configured by a user
   */
  _aspectPanes: on('init', computed('_aspects','_panes',function() {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    let aspectPanes = [];
    if(aspects && panes) {
      for (let aspect of aspects) {
        aspectPanes.push(aspect);
        for (let pane of panes) {
          aspectPanes.push(aspect + capitalize(pane));
        }
      }      
    }
    
    return aspectPanes;
  })),
  

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
    const aspectPanes = this.get('_aspectPanes'); // jshint ignore:line
    
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
  _defineAspectMappings: on('init', observer('_aspectPanes', function() {
    const aspectPanes = this.get('_aspectPanes');
    for (let aspectPane of aspectPanes) {
      if(this._getMap(aspectPane)) {
        let cp = computed.readOnly(this._getMap(aspectPane));
        defineProperty(this, aspectPane, cp);        
      }
    }
  })),

	_getMap: function(property) {
    return this.get(`map${capitalize(property)}`) || this.get(`map.${property}`);
	},
  
  // Default Values
  _setDefaultValues: on('init', function() {
    const aspectPanes = this.get('_aspectPanes');
    for (let item of aspectPanes) {
      const defaultKey = 'default' + capitalize(item);
      if(!this.get(item) && this[defaultKey]) {
        this.set(item, this[defaultKey]);
      }
    }    
  }),
  
  /**
   * Registers the item with a parent list (if one exists)
   */
  _register: on('didInsertElement', function() {
    const register = this.get('list.registration');
    if(register) {
      register(this);
    }
  }),
  _unRegister: on('didRemoveElement', function() {
    const list = this.get('list');
  })
});

SharedItem[Ember.NAME_KEY] = 'Item Mixin';
export default SharedItem;