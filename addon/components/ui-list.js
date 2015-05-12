import Ember from 'ember';
import ObserveAll from 'ember-cli-observe-all/mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys, defineProperty, debug, capitalize } = Ember;    // jshint ignore:line

import layout from '../templates/components/ui-list';

export default Ember.Component.extend(Ember.SortableMixin,{
  queryParams: ['sortProperties', 'sortAscending'],
  sort: null,
  items: on('init', computed(function(key, value){
    // setter
    if(arguments.length > 1) {
      const watcher = Ember.Object.extend(ObserveAll).create();
      value = new A(value);
      return new A(value.map(item => { 
        item = item.set ? item : Ember.Object.create(item);
        // add observers for set properties (allowing for change detection of _items)
        watcher.observeAll(item, (key) => {
          console.log('detected change to %s', key);
        });
        
        return item;
      }));
    }
    // initial state / getter
    return new A([]);  
  })),
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
        break;
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
  _itemProperties: null,
  _listProperties: ['size','mood','style'],
  _metaMutex: 0,
  _metaObserverReferences: new A([]),
  _metaObservers: on('didInsertElement', function() {
    const listProps = new A(this.get('_listProperties'));
    listProps.forEach( prop => {
      let refs = new A(this.get('_metaObserverReferences'));
      if(!refs.contains(prop)) {
        run.once( () => {
          this.addObserver(prop, this, this._notifyMetaChange);
          refs.push(prop);          
        });
      }
    });
  }),
  _notifyMetaChange: function() {
    this.notifyPropertyChange('_metaMutex');
  },
  _metaCleanup: on('willDestroyElement', function() {
    let refs = new A(this.get('_metaObserverReferences'));
    refs.forEach( prop => {
      this.removeObserver(prop, this, this._notifyMetaChange);
      refs.reject( item => {
        return item === prop;
      });
    });
  }),
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
  content: on('init', computed('items.[]','items.@each._propertyChanged', '_metaMutex', function() {
    const content = new A(this.get('items').map( item => {
      return Ember.Object.create(item);
    }));
    console.log('building content');
    // FILTER
    // -------------------------------
    const filter = this.get('filter');
    let filteredContent = null;
    switch(typeOf(filter)) {
    case "function":
      filteredContent = content.map( filter );
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
    console.log('content filtered');
    // Structural Constants
    // -------------------------------
    const aspects = new A(this.get('_aspects'));
    const panes = new A(this.get('_panes'));
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
      console.log('listProperties included');
      
      // Resolve inline functions and set default values
      keys(item).forEach( prop => {
        if(typeOf(item[prop]) === 'function') {
          const itemFunc = item[prop];
          item[prop] = itemFunc(item,filteredContent);
        } else if (!item[prop] && this._getDefaultValue(prop)) { 
          item.set(prop, this._getDefaultValue(prop));
        }
      });
      console.log('inline funcs included');
      // Aspects, Panes, and Maps
      aspects.forEach( aspect => {
        if(this._getMap(aspect)) {
          item.set(aspect, item[this._getMap(aspect)]);
          // panes.forEach( pane => {
          //   let aspectPane = aspect + Ember.String.capitalize(pane);
          //   item.set(aspectPane, item[this._getMap(aspect,pane)]);
          // });
        };
      });
      console.log('aspects included');
      
      return item;
    });
    
    return filteredContent;
  })),
  
  _getMap: function(aspect, pane=null) {
		pane = pane ? capitalize(pane) : '';
		aspect = aspect + pane;
    return this.get(`map${Ember.String.capitalize(aspect)}`) || this.get(`map.${aspect}`);
	},
  _getDefaultValue: function(prop) {
    // const value = this.get('default' + capitalize(prop));
    // return value ? value : false;
    return false;
  }
});
