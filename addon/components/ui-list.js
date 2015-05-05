import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf } = Ember;    // jshint ignore:line

import layout from '../templates/components/ui-list';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'div',
  classNames: ['ui-list','list-container'],
  items: null,
  _items: on('init', computed('items','map', 'mood', function() {
    let aspects = [ 'icon', 'image', 'badge', 'title','subHeading' ];
    let panes = [ 'left', 'center', 'right' ];
    let globalAspects = [ 'mood' ];
    let {items, map} = this.getProperties('items','map');
    if(!items) {
      items = new A([]);
    }
    items = items.contains ? items : A(items);
    return A(items.map( item => {
      // mapping starts with a copy so any additional properties are maintained
      let result = Ember.Object.create(item);
      // check each aspect
      aspects.forEach( aspect => {
        result.set(aspect, this.setAspect(aspect,null,item));
        // check each pane
        panes.forEach( pane => {
          let aspectPane = aspect + Ember.String.capitalize(pane);
          result.set(aspectPane, this.setAspect(aspect,pane,item));
        });
      }); // end aspects
      // iterate global aspects
      globalAspects.forEach( aspect => {
        result.set(aspect, this.setAspect(aspect,null,result));
      });
      
      return result;
    }));
  })),
  setAspect: function(aspect,pane,dynamicItem) {
    let map = this.get('map') || {};
    let propName = pane ? aspect + Ember.String.capitalize(pane) : aspect;
    let propValue = this.get(propName);
    let defaultProp = 'default' + Ember.String.capitalize(propName);
    // static properties always win
    if(propValue) {
      if(typeOf(propValue) === 'function') {
        return propValue(dynamicItem);
      } else {
        return propValue;
      }
    } else if(map[aspect] && dynamicItem[map[aspect]]) {
      // Mapper found a matched property
      return dynamicItem[map[aspect]];
    } else if(dynamicItem[propName]) {
      // No need for mapper, property exists in object
      return dynamicItem[propName];
    } else if(this.get(defaultProp)) {
      return this.get(defaultProp);
    }
    
    return null;
  },
  mood: null
});
