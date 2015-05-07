import Ember from 'ember';
import ObserveAll from '../mixins/observe-all';
const { computed, observer, $, A, run, on, typeOf, keys } = Ember;    // jshint ignore:line

import layout from '../templates/components/ui-list';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'div',
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed'],
  compressed: false,
  items: on('init',computed(function(key, value, previousValue) {
    // setter
    if(arguments.length > 1) {
      let WatchedObject = Ember.Object.extend(ObserveAll).create();
      return A(value).map(item => { 
        item = item.set ? item : Ember.Object.create(item);
        // add observers for set properties (allowing for change detection of _items)
        run.once( () => {
          WatchedObject.observeAll(item, (key) => {
            // do something?
          });                
        })
        return item;
      });
    }
    // getter / initial value
    return A({});
  })),
  itemsObserveAll: on('afterRender', computed('items.[]', function() {
    let items = this.get('items');
    items.forEach( item => {
    })
  })),
  // _items mirrors the items array and then adorns it with:
  //   a) the "map" is used to created computed aliases
  //   b) in those properties who have business logic / functions, the logic is executed to produce a scalar result
  // this array will be updated whenever a change is detected in 'items'
  _items: on('didInsertElement', computed('items.[]', 'items.@each._propertyChanged', 'map', 'mood',  function() { 
    let aspects = [ 'icon', 'image', 'badge', 'title','subHeading' ];
    let panes = [ 'left', 'center', 'right' ];
    let itemProproperties = [ 'mood' ]; // global means global to an item (aka, not constrained to a pane)
    let items = this.get('items');
    let mapper = this.get('map');
    if(!items) {
      items = new A([]);
    }
    items = items.contains ? items : A(items);
    return A(items.map( item => {
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
  mood: null
});
