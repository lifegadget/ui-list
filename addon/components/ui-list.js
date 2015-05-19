import Ember from 'ember';
import ObserveAll from 'ember-cli-observe-all/mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys, defineProperty, debug, merge } = Ember;    // jshint ignore:line
const capitalize = Ember.String.capitalize;
const camelize = Ember.String.camelize;

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
    const mapHash = typeOf(this.get('map')) === 'object' ? this.get('map') : {};
    const mapProps = new A(keys(this).filter( prop => {
      return prop.length > 3 && prop.slice(0,3) === 'map' && prop !== 'mapBinding';
    }));
    mapProps.forEach( propertyMap => {
      const key = camelize(propertyMap.slice(3));
      mapHash[key] = this.get(propertyMap);
    });
    return mapHash;
  }),
  _mappedFrom: computed('mappedProperties', function() {
    const mp = this.get('mappedProperties');
    
    return new A(keys(mp).map(item => {
      return mp[item];
    }));
  }),

  /**
   * Content is immutable copy of items with the ability to be filtered
   */
  content: computed('items.[]','filter','items.@each._propertyChanged', function() {
    const content = new A(this.get('items'));
    const filter = this.get('filter');
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
    
    return filteredContent;
  }),
  /**
   * Keeps track of what properties are set across items so that items components can be more 
   * conservative on their observer usage
   */
  _itemSetProperties: on('beforeRender',computed('items', function() {
    const possibleAspectPanes = new A(this.get('aspectPanes'));
    const mappedFrom = this.get('_mappedFrom');
    let aspectPanes = keys(this.get('mappedProperties'));
    console.log('aspectPanes: %o', aspectPanes);
    console.log('mappedFROM!!!!!!!!: %o', mappedFrom);
    let otherProperties = new A([]);
    this.get('content').forEach( item => {
      console.log('item: %s', item.get('foo'));
      aspectPanes = aspectPanes.concat(
        keys(item).filter( itemProp => {
            return possibleAspectPanes.contains(itemProp);
        })
      );
      otherProperties = otherProperties.concat(
        keys(item).filter( itemProp => {
          return !possibleAspectPanes.contains(itemProp) && itemProp.slice(0,1) !== '_' && !mappedFrom.contains(itemProp);
        })
      );
    });
    return {
      aspectPanes: new A(aspectPanes).uniq(),
      otherProperties: new A(otherProperties).uniq()
    };    
  })),
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
