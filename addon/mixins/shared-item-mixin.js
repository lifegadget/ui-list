import Ember from 'ember';
const { keys } = Object;
const { computed, typeOf, defineProperty, merge } = Ember;
const a = Ember.A;

const capitalize = Ember.String.capitalize;
const dasherize = thingy => {
  return thingy ? Ember.String.dasherize(thingy) : thingy;
};

let SharedItem = Ember.Mixin.create({
  classNames: ['ui-list','item'],
  classNameBindings: ['selected','_evenOdd'],
  attributeBindings: ['tabindex'],
  /**
   * meant to be a PK for an item
   */
  id: computed('title', {
    set(_,value) {
      return value;
    },
    get() {
      return dasherize(this.get('title'));
    }
  }),
  index: null,
  _evenOdd: computed('index', function() {
    const index = this.get('index');
    if(typeOf(index) === 'null') { return null; }

    return index % 2 === 0 ? 'odd' : 'even';
  }),


  /**
   * The specific Item components should define which aspects and panes they support, this
   * just bring together the resultant array of aspectPanes which could be targetted/configured by a user
   */
  _aspectPanes: computed('_aspects','_panes',function() {
    const aspects = a(this.get('_aspects'));
    const panes = a(this.get('_panes'));
    let aspectPanes = [];
    aspects.map( aspect => {
      aspectPanes.push(aspect);
      panes.map( pane => {
        aspectPanes.push(aspect + capitalize(pane));
      });
    });

    return aspectPanes;
  }),

  /**
   * INITIALIZE ITEM COMPONENT
   */
  init() {
    this._super(...arguments);
    this._unpackData();       // map the data hash populated by list component onto item object
    this._shortcutAliases();  // add convenience API-surface shortcuts (e.g., 'icon' instead of 'leftIcon', etc.)
    this._defineAspectMappings(); // ensure all mappings are setup as CP's
    this._logicPanes();       // create hasXXX() logic flags for page existance
  },
  didInsertElement() {
    this._super(...arguments);
    this._setDefaultValues();
  },

  // Unpack data property passed in from a list
  _unpackData: function() {
    const data = this.get('data') || {};
    const unpack = this.get('unpack') ? this.get('unpack') : keys(data);
    if(unpack) {
      unpack.map(prop => {
        const cp = computed.alias(`data.${prop}`);
        defineProperty(this, prop, cp);
      });
    }
  },
  _shortcutAliases: function() {
    const defaultAliases = {
      title: 'centerTitle',
      subHeading: 'centerSubHeading'
    };
    const paneAliases = merge(defaultAliases,this.get('paneAliases'));
    keys(paneAliases).map( key => {
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
    const panes = a(this.get('_panes'));
    const aspects = a(this.get('_aspects'));
    panes.map( pane => {
      const property = 'has' + capitalize(pane) + 'Pane';
      const relevantAspects = aspects.map(aspect=>{ return aspect + capitalize(pane); });
      const cp = computed.or(...relevantAspects);
      defineProperty(this,property,cp);
    });
  },

  // Initialize "Dereferenced Computed Properties"
	// ---------------------------------------------
	// NOTE: 'map' is a dereferenced hash of mappings;
  // an item can use either a map or individual property assignments
	// of the variety item.fooMap = 'mappedTo'
  _defineAspectMappings: function() {
    const aspectPanes = a(this.get('_aspectPanes'));
    aspectPanes.map( aspectPane => {
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
    aspectPanes.map( item => {
      const defaultKey = 'default' + capitalize(item);
      if(!this.get(item) && this[defaultKey]) {
        this.set(item, this[defaultKey]);
      }
    });
  },

});

SharedItem[Ember.NAME_KEY] = 'Shared Item Props';
export default SharedItem;
