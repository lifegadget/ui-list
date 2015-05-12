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
  items: on('init', computed(function(key, value){
    // setter
    if(arguments.length > 1) {
      const watcher = Ember.Object.extend(ObserveAll).create();
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
          console.log('detected change to %s', key);
        });
        
        return item;
      }));
    }
    // initial state / getter
    return new A([]);  
  })),
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
  _aspects: null,
  _panes: null,
  _aspectPanes: on('init', computed('_aspects','_panes', function() {
    const aspects = this.get('_aspects');
    const panes = this.get('_panes');
    if(!aspects) {
      return new A([]);
    }
    const aspectPanes = new A(aspects);
    aspects.forEach( aspect => {
      panes.forEach( pane => {
        aspectPanes.push(aspect + capitalize(pane));
      });
    });
    
    return aspectPanes;
  })),
  _itemProperties: null,
  _listProperties: ['size','mood','style'],
  /**
  *  Look at the particular type of Item this list manages to determine 
  *  the "aspects", "panes", and "itemProperties" that it is concerned with
  */
  _introspectItemScope: on('init', function() {
    // note: I do not know how to do this introspection so hard coding for now
    this.set('_aspects', [ 'icon', 'image', 'badge', 'title','subHeading' ]);
    this.set('_panes', [ 'left', 'center', 'right' ]);
    this.set('_itemProperties', []);
  }),
  /**
   * Content is immutable copy of items with the following enhancements:
   * 
   *   1. Items are filtered based on the the 'filter' property
   *   2. Any functions() assigned to aspectPanes are resolved and replaced with resolved values
   *   2. aspect/panes properties are packaged up as hash and passed to the item as a single property 'aspectPanes'
   *   3. itemProperties are also packaged up as a hash and passed to the item as a single property 'itemProperties'
   */
  content: on('init', computed('items.[]','items.@each._propertyChanged', function() {
    const itemsArray = this.get('items') ? this.get('items') : new A([]);
    const content = new A(itemsArray.map( item => {
      return Ember.Object.create(item); 
    }));
    console.log('building content');
    // FILTER
    // -------------------------------
    const filter = this.get('filter');
    let filteredContent = null;
    switch(typeOf(filter)) {
    case "function":
      filteredContent = new A(content.map( filter ));
      break;
    case "object":
      filteredContent = new A(content.filterBy(filter.key,filter.value));
      break;
    case "array":
      filteredContent = new A(content.filterBy(filter[0],filter[1]));
      break;
    default:
      filteredContent = content;
    }    
    console.log('content filtered');
    // Structural Constants
    // -------------------------------
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
    const aspectPanes = this.get('_aspectPanes');
    const listProperties = this.get('_listProperties');
    
    // Iterate over Items
    // --------------------------------
    filteredContent.forEach( item => {
      // Add List Properties to Content
      listProperties.forEach( prop => {
        let propFunc, propValue;
        if(typeOf(this.get(prop)) === 'function') {
          propFunc = this.get(prop);
          propValue = propFunc(item,filteredContent);
        } else {
          propValue = this.get(prop);
        }
        item[prop] = propValue;
      });
      
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
      item.packed = item.packed ? item.packed : {};
      aspectPanes.forEach( ap => {
        // map where map exists
        if(this._getMap(ap)) {
          item[ap] = item[this._getMap(ap)];
        }
        // put property into packed property if non-null
        if(item[ap] !== null) {
          item.packed[ap] = item[ap];
        }
      })
      
      return item;
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
  }
});
