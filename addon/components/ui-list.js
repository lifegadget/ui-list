import Ember from 'ember';
import ObserveAll from 'ember-cli-observe-all/mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys, defineProperty, debug } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;

import layout from '../templates/components/ui-list';

export default Ember.Component.extend(Ember.SortableMixin,{
  queryParams: ['sortProperties', 'sortAscending'],
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
  _watcher: Ember.Object.extend(ObserveAll).create(),
  /**
   * The function of this computed properties is simply to add or remove observation points for the individual properties
   * of a given an array element (aka, an item)
   */
  items: computed( {
    set: function(key, value) {
      const watcher = this.get('_watcher');
      // release all old observations
      watcher.destroyObservers();
      value = value ? new A(value) : new A([]);
      return new A(value.map( item => {
        // ensure we have an Ember object
        item = item.set ? item : Ember.Object.create(item);
        // add observers allowing for change detection of 'content'
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
  }),
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
  sortAscending: true,
  layout: layout,
  tagName: 'div',
  type: 'UiItem', // the type of Item contained by this list
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed'],
  compressed: false, // horizontal space compression between items (provided via CSS),
  // List Meta
  _aspects: [ 'icon', 'image', 'badge', 'title','subHeading' ],
  _panes: [ 'left', 'center', 'right' ],
  /**
   * The specific Item components should define which aspects and panes they support, this 
   * just bring together the resultant array of aspectPanes which can be targetted/configured by a user
   */
  _aspectPanes: on('init', computed('_aspects','_panes',function() {
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
  })),
  _itemProperties: null,
  _listProperties: ['size','mood','style','squeezed'],
  /**
   * Content is immutable copy of items with the following enhancements:
   * 
   *   1. Items are filtered based on the the 'filter' property
   *   2. Any functions() assigned to aspectPanes are resolved and replaced with resolved values
   *   2. aspect/panes properties are packaged up as hash and passed to the item as a single property 'packed'
   *   3. itemProperties are also packaged up as a hash and passed to the item as a single property 'itemProperties'
   */
  content: on('init', computed('items.[]','filter','items.@each._propertyChanged', function() {
    const itemsArray = this.get('items') ? this.get('items') : new A([]);
    if(!itemsArray) {
      return new A([]);
    }
    const content = new A(itemsArray.map( item => {
      const data = item.get('_data'); // if its an ember-data object then data is locked up in the _data property
      item = data ? data : item;
      return Ember.Object.create(item); 
    }));
    // FILTER
    // -------------------------------
    const filter = this.get('filter');
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
    // Structural Constants
    // -------------------------------
    const aspectPanes = this.get('_aspectPanes');
    let keyAspectPanes = {};
    
    // Iterate over Items
    // --------------------------------
    filteredContent.forEach( item => {      
      // Resolve inline functions and set default values
      keys(item).forEach( prop => {
        if(typeOf(item[prop]) === 'function') {
          const itemFunc = item[prop];
          item[prop] = itemFunc(item,filteredContent);
        } else if (!item[prop] && this._getDefaultValue(prop)) { 
          item[prop] = this._getDefaultValue(prop);
        }
      });
      // Aspects, Panes, and Maps
      item.aspectPanes = item.aspectPanes ? item.aspectPanes : {};
      aspectPanes.forEach( ap => {
        // map where map exists
        if(this._getMap(ap)) {
          item[ap] = item[this._getMap(ap)];
        }
        // put property into packed property if non-null
        if(item[ap]) {
          item.aspectPanes[ap] = item[ap];
          keyAspectPanes[ap] = true;
        }
      });
      
      return item;
    });
    // add inter-aspect packed properties to each item
    keyAspectPanes = keys(keyAspectPanes);
    filteredContent.forEach( item => {
      item.keyAspectPanes = keyAspectPanes;
    });
    
    return filteredContent;
  })),
  
  _getMap: function(aspect, pane=null) {
		pane = pane ? capitalize(pane) : '';
		aspect = aspect + pane;
    return this.get('map' + capitalize(aspect)) || this.get(`map.${aspect}`);
	},
  _getDefaultValue: function(prop) {
    const value = this.get('default' + capitalize(prop));
    return value ? value : false;
  },
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
