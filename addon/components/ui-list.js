import Ember from 'ember';
import ObserveAll from '../mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys, defineProperty } = Ember;    // jshint ignore:line

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
  sortAscending: true,
  layout: layout,
  tagName: 'div',
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed'],
  compressed: false,
  items: on('init',computed(function(key, value) {
    // setter
    if(arguments.length > 1) {
      let watcher = Ember.Object.extend(ObserveAll).create();
      return new A(value).map(item => { 
        item = item.set ? item : Ember.Object.create(item);
        // add observers for set properties (allowing for change detection of _items)
        watcher.observeAll(item, (key) => {
          console.log('detected change to %s', key);
        });
        
        return item;
      });
    }
    // getter / initial value
    return new A({});
  })),
  // _items mirrors the items array and then adorns it with:
  //   a) the "map" is used to created computed aliases
  //   b) in those properties who have business logic / functions, the logic is executed to produce a scalar result
  // this array will be updated whenever a change is detected in 'items'
  content: on('didInsertElement', computed('items.[]', 'items.@each._propertyChanged', 'map', 'mood',  function() { 
    console.log('reprocessing _items');
    let aspects = [ 'icon', 'image', 'badge', 'title','subHeading' ];
    let panes = [ 'left', 'center', 'right' ];
    let itemProproperties = [ 'mood' ]; 
    let items = this.get('items');
    console.log('items: %o', items);
    let mapper = this.get('map');
    return new A(items.map( item => {
      let result = item;
      // set aliases for mapped properties
      if(mapper) {
        Ember.keys(mapper).forEach(prop => {
          Ember.defineProperty(result, prop, computed.alias(mapper[prop]));
        }); 
      } 
      // iterate through Aspects (and AspectPanes)
      aspects.forEach( aspect => {
        result.set(aspect, this.setAspect(aspect,null,result));
        // check each pane
        panes.forEach( pane => {
          let aspectPane = aspect + Ember.String.capitalize(pane);
          result.set(aspectPane, this.setAspect(aspect,pane,result));
        });
      });
      // iterate item-scoped properties
      itemProproperties.forEach( itemProperty => {
        result.set(itemProperty, this.setAspect(itemProperty,null,result));
      });
      
      return result;
    }));
  })),
  setAspect: function(aspect,pane,dynamicItem) {
    let propName = pane ? aspect + Ember.String.capitalize(pane) : aspect;
    let propValue = this.get(propName);
    let defaultProp = 'default' + Ember.String.capitalize(propName);
    let aspectValue = null;
    if(propValue) {
      aspectValue = propValue;
    } else if(dynamicItem.get(propName)) {
      aspectValue = dynamicItem.get(propName);
    } else if(this.get(defaultProp)) {
      aspectValue = this.get(defaultProp);
    } else {
      aspectValue = null;
    }
    
    if(typeOf(aspectValue) === 'function') {
      // run business logic to determine value
      aspectValue = aspectValue(dynamicItem,this.get('items'));
    } 
    
    return aspectValue;
  },
  mood: null,
});
