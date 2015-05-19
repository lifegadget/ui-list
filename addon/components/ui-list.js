import Ember from 'ember';
import ObserveAll from 'ember-cli-observe-all/mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys, defineProperty, debug, merge } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;
import layout from '../templates/components/ui-list';

export default Ember.Component.extend(Ember.SortableMixin,{
  sort: null,
  sortProperties: on('init', computed('sort', function() {
    let sort = this.get('sort');
    if(typeOf(sort) === 'string') {
      sort.split(',');
      if(typeOf(sort) === 'string') {
        sort = [sort];
      }
    }
    
    return typeOf(sort) === 'array' ? sort : null;
  })),
  sortAscending: true,
  layout: layout,
  tagName: 'div',
  type: 'UiItem', // the type of Item contained by this list
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed'],
  compressed: false, // horizontal space compression between items (provided via CSS),
  _watcher: Ember.Object.extend(ObserveAll).create(),
  /**
   * The function of this computed properties is simply to add or remove observation points for the individual properties
   * of a given an array element (aka, an item)
   */
  items: on('init', computed( {
    set: function(key, value) {
      const watcher = this.get('_watcher');
      // release all old observations
      watcher.destroyObservers();
      value = value ? new A(value) : new A([]);
      return new A(value.map( item => {
        // ensure we have an Ember object
        item = item.set ? item : Ember.Object.create(item);
        // add observers allowing for change detection of 'deep content' (aka, properties of array objects)
        watcher.observeAll(item, (key) => {
          const callback = this.get('_propertyChangedCallback');
          if(callback && typeOf(callback) === 'function') {
            callback(key);
          }
        });

        return item;
      }));
    },
    get: function() {
      // initial state / getter
      return new A([]);
    }
  })),
  // FILTER SETTING
  // ------------------
  filter: null,
  _filter: computed('filter', function() {
    const filter = this.get('filter');
    switch(typeOf(filter)) {
      case "object":
        if(!filter.key || !filter.value) {
          debug('Attempted to set a filter object but did not set key and value properties: ' + JSON.stringify(filter));
          return null;
        }
        break;
      case "array":
        if(filter.length !== 2) {
          debug('Attempted to set a filter as an array with the wrong number of parameters: ' + JSON.stringify(filter));
          return null;
        }
        break;
      case "string":
      case "number":
        debug('Invalid attempt to set list filter as a scalar value');
        return null;
    }

    return filter;
  }),
  // List Meta
  _aspects: [ 'icon', 'image', 'badge', 'title','subHeading' ],
  _panes: [ 'left', 'center', 'right' ],
  /**
   * The specific Item components should define which aspects and panes they support, this
   * just bring together the resultant array of aspectPanes which can be targetted/configured by a user
   */
  aspectPanes: computed('_aspects','_panes',function() {
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
    let aspectPanes = [];
    if(aspects && panes) {
      aspects.forEach( aspect => {
        aspectPanes.push(aspect);
        panes.forEach( pane => {
          aspectPanes.push(aspect + capitalize(pane));
        });
      });
    }

    return aspectPanes;
  }),
  _itemProperties: null,
  _listProperties: ['size','mood','style','squeezed'],
  mappedProperties: computed(function() {
    const mapHash = this.get('map') || {};
    const mapProps = keys(this).filter( prop => {
      return prop.length > 3 && prop.slice(0,3) === 'map' && prop !== 'mapBinding';
    }) || {};
    return merge(mapHash, mapProps);
  }),
  _mappedFrom: computed('mappedProperties', function() {
    const mp = this.get('mappedProperties');
    return new A(keys(mp).map(item => {
      return mp[item];
    }));
  }),

  /**
   * Content is immutable copy of items with the following enhancements:
   *
   *   1. Items are filtered based on the the 'filter' property
   *   2. Any functions() assigned to aspectPanes are resolved and replaced with resolved values
   *   2. aspect/panes properties are packaged up as hash and passed to the item as a single property 'packed'
   *   3. itemProperties are also packaged up as a hash and passed to the item as a single property 'itemProperties'
   */
  content: computed('items.[]','filter','items.@each._propertyChanged', function() {
    const content = new A(this.get('items'));
    const filter = this.get('filter');
    let   keyAspectPanes = {}; // aka, those which are set somewhere in the list
    let   otherProperties = {}; // aka, those props which are set but NOT aspectPanes
    // FILTER
    // -------------------------------
    let filteredContent = null;
    switch(typeOf(filter)) {
    case "function":
      filteredContent = content.filter(filter, this);
      break;
    case "object":
      filteredContent = content.filterBy(filter.key,filter.value);
      break;
    case "array":
      filteredContent = content.filterBy(filter[0],filter[1]);
      break;
    default:
      filteredContent = content;
    }

    // Iterate and:
    // a) add aspectPanes property (hash)
    // b) add options property (non aspectPane properties in hash)
    // c) add defaults property (hash of default Values)
    // c) determine cross-item keyAspectPanes and keyOptions
    filteredContent.forEach( item => {
      keys(item).forEach( prop => {
        switch(this._propertyType(prop)) {
        case "aspectPane":
          keyAspectPanes[prop] = true;
          break;
        case "mapped":
          keyAspectPanes[this._isMappedProperty(prop)] = true;
          break;
        case "option":
          otherProperties[prop] = true;
          break;
        default:
          // ignored
          break;
        }
      });

      return item;
    });
    // add inter-aspect packed properties to each item
    // this.set('keyAspectPanes', keys(keyAspectPanes));
    // this.set('otherProperties', keys(otherProperties));

    return filteredContent;
  }),
  keyAspectPanes: [],
  otherProperties: [],
  _propertyType: function(prop) {
    const aspectPanes = new A(this.get('aspectPanes'));
    if(aspectPanes.contains(prop)) {
      return 'aspectPane';
    } else if (prop.slice(0,1) === '_') {
      return 'ignore';
    } else if (this._isMappedProperty(prop)) {
      return 'mapped';
    } else {
      return 'option';
    }
  },
  _isMappedProperty: function(prop) {
    const mp = this.get('mappedProperties');
    const mappedFrom = this.get('_mappedFrom');

    return mappedFrom.contains(prop) ? mp[prop] : false;
  },

  // REGISTRATION
  // ----------------------------------
  _registeredItems: new A([]),
  register: function(item) {
    const registeredItems = this.get('_registeredItems');
    registeredItems.pushObject(item);
    // on first registered item, ask for meta information from item type
    if(registeredItems.length === 1) {
      this.set('_aspects', item.get('_aspects'));
      this.set('_panes', item.get('_panes'));
    }
  },
  deregister: function(item) {
    const registeredItems = this.get('_registeredItems');
    registeredItems.removeObject(item);
  }
});
