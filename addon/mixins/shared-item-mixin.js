import Ember from 'ember';
const { Mixin, computed, observer, $, A, run, on, typeOf, defineProperty, keys, get, merge } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

let SharedItem = Mixin.create({
  _tellGroup: function (action,options={}) {
    const list = this.get('list');
    if(get(list,'_itemListener')) {
      list._itemListener(action, this, options); // tell group listener
    } else {
      this.sendAction(action, this, options); // broadcast to container
    }
  },
  _actionEffects: function(action,options) { // jshint ignore: line
    // default handler does nothing, up to specific type to add functionality
  },

  // Convenience Aliases and Defaults
  mood: 'default',
  style: 'default',
  size: 'default',
  skin: computed.alias('style'),
  color: computed.alias('mood'),

  // COMPUTED PROPERTIES
  // -------------------------

  // Classy stuff
  classNames: ['ui-list','item'],
  classNameBindings: ['_size','_style','disabled:disabled:enabled', '_mood','squeezed','selected' ],

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
   * The specific Item components should define which aspects and panes they support, this
   * just bring together the resultant array of aspectPanes which could be targetted/configured by a user
   */
  _aspectPanes: computed('_aspects','_panes',function() {
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
    let aspectPanes = [];
    aspects.forEach( aspect => {
      aspectPanes.push(aspect);
      panes.forEach( pane => {
        aspectPanes.push(aspect + capitalize(pane));
      });
    });

    return aspectPanes;
  }),

  /**
   * INITIALIZE ITEM COMPONENT
   */
  _init: on('init', function() {
    this._unpackData();       // data hash populated by list component
    this._shortcutAliases();  // add convenience API-surface shortcuts (e.g., 'icon' instead of 'leftIcon', etc.)
    this._defineAspectMappings(); // ensure all mappings are setup as CP's
    this._logicPanes();       // create hasXXX() logic flags for page existance
    this._setDefaultValues();
  }),

  // Unpack data property from a list
  _unpackData: function() {
    const ignoredProperties = new A(['toString','toArray', 'isTruthy']);
    const isEmberData = typeOf(get(this, 'data.data')) === 'object' ? true : false;
    const isDecorated = isEmberData && this.get('data.isTruthy') ? true : false;
    const notPrivate = property => { return property.substr(0,1) !== '_'; };
    const notIgnored = property => { return !ignoredProperties.contains(property); };
    const safeProperties = property => { return notPrivate(property) && notIgnored(property); };
    const dataSource = isEmberData ? get(this, 'data.data') : get(this,'data');
    let   reflector = dataSource ? keys(dataSource) : [];
    const data = get(this, 'data');
    // NOTE: this whole ED nonsense can be removed if we can get the ProxyMixin working again but until then we
    // need to detect decorated properties somehow as the Ember.keys() method does not properly reflect ED arrays
    if(isDecorated) {
        let decorators = [];
        for (let property in data) {
          if(property.substr(0,1) !== '_') {
            if(!data.hasOwnProperty(property) && property.substr(0,1) !== '_' && typeOf(data[property]) === 'object') {
              decorators.push(property);
            }
          }
        }
        reflector = reflector.concat(decorators);
    }
    reflector = reflector.concat(this.get('_aspectPanes'));
    reflector.filter(safeProperties).forEach( key => {
      // create CP on root and point back to attribute on data hash
      let cp = computed.readOnly(`data.${key}`);
      if(this.get(`data.${key}`)) {
        defineProperty(this, key, cp);
      }
    });
  },
  _shortcutAliases: function() {
    const defaultAliases = {
      title: 'centerTitle',
      subHeading: 'centerSubHeading'
    };
    const paneAliases = merge(defaultAliases,this.get('paneAliases'));
    keys(paneAliases).forEach( key => {
      // if property exists (as it will if data hash has mapped a CP there already), create reverse alias
      let cp;
      if(!this.get(key)) {
        cp = computed.alias(paneAliases[key]);
        defineProperty(this, key, cp);
      } else {
        cp = computed.alias(key);
        defineProperty(this, paneAliases[key], cp);
      }
    });
  },

  /**
   * setup up logical flags to indicate the existance of content on a per pane basis
   */
  _logicPanes: function() {
    const panes = new A(this.get('_panes'));
    const aspects = new A(this.get('_aspects'));
    panes.forEach( pane => {
      const property = 'has' + capitalize(pane) + 'Pane';
      const relevantAspects = aspects.map(aspect=>{ return aspect + capitalize(pane); });
      const cp = computed.or(...relevantAspects);
      defineProperty(this,property,cp);
      this.notifyPropertyChange(property);
    });
  },

  // Initialize "Dereferenced Computed Properties"
	// ---------------------------------------------
	// NOTE: 'map' is a dereferenced hash of mappings; an item can use either a map or individual property assignments
	// of the variety item.fooMap = 'mappedTo';
  _defineAspectMappings: function() {
    const aspectPanes = new A(this.get('_aspectPanes'));
    aspectPanes.forEach( aspectPane => {
      if(this._getMap(aspectPane)) {
        let cp = computed.readOnly(this._getMap(aspectPane));
        defineProperty(this, aspectPane, cp);
      }
    });
  },
	_getMap: function(property) {
    return this.get(`map${capitalize(property)}`) || this.get(`map.${property}`);
	},

  // Default Values
  _setDefaultValues: function() {
    const aspectPanes = this.get('_aspectPanes');
    aspectPanes.forEach( item => {
      const defaultKey = 'default' + capitalize(item);
      if(!this.get(item) && this[defaultKey]) {
        this.set(item, this[defaultKey]);
      }
    });
  },

  /**
   * Registers the item with a parent list (if one exists)
   */
  _register: on('afterRender', function() {
    const list = this.get('list');
    if(this.get('list.register')) {
      list.register(this);
    }
  }),
  _deregister: on('willDestroyElement', function() {
    const list = this.get('list');
    if(this.get('list.deregister')) {
      list.deregister(this);
    }
  })
});

SharedItem[Ember.NAME_KEY] = 'Item Mixin';
export default SharedItem;
