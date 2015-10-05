import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line
const capitalize = Ember.String.capitalize;
const camelize = Ember.String.camelize;

import layout from '../templates/components/ui-list';
import ListMessaging from '../mixins/list-messaging';
import NodeMessenger from '../mixins/node-messenger';

var UiList = Ember.Component.extend(ListMessaging,NodeMessenger,{
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed','horizontal:horizontal:vertical', '_skin', 'striping:stripe'],
  _componentType: 'list',
  sort: null,
  sortDirection: 'ascending',
  layout: layout,
  tagName: 'div',
  tabindex: false,
  pagination: false,
  striping: false,

  arrangedContent: computed('content', 'sort', 'sortDirection', function() {
    const {sort,sortDirection,filter} = this.getProperties('sort','sortDirection','filter');
    let content = a(this.get('content')).slice(0);
    const isAscending = sortDirection === 'ascending';
    if(filter) {

    }
    if(sort) {
      content.sort((a,b) => {
        if(isAscending) {
          if(get(a,sort) > get(b,sort)) { return -1; }
          if(get(a,sort) === get(b,sort)) { return 0; }
          if(get(a,sort) < get(b,sort)) { return 1; }
        } else {
          if(get(a,sort) > get(b,sort)) { return 1; }
          if(get(a,sort) === get(b,sort)) { return 0; }
          if(get(a,sort) < get(b,sort)) { return -1; }
        }
      });
    }
    return content;
  }),
  itemType: computed('type', function() {
    const type = this.get('type');

    return type ? type : 'UiItem';
  }),
  _skin: computed('skin', function() {
    const {skin} = this.getProperties('skin');
    return skin ? `skin-${skin}` : false;
  }),
  mouseEnter(e) {
    this.sendAction('onHover', {
      granularity: 'list',
      state: true,
      eventTrigger: 'mouse-enter',
      originatedBy: this,
      event: e
    });
    return true;
  },
  mouseLeave(e) {
    this.sendAction('onHover', {
      originatedBy: this,
      granularity: 'list',
      state: false,
      eventTrigger: 'mouse-leave',
      event: e
    });
    return true;
  },

  type: 'ui-item', // the type of Item contained by this list
  compressed: false, // vertical space compression
  prepareItems() {
    let result = a();
    let items = a(this.get('items'));
    items = typeOf(items) === 'string' ? items.split(',') : items;
    items.forEach(item => {
      switch(typeOf(item)) {
        case 'instance':
          result.pushObject(item);
          break;
        case 'object':
          result.pushObject(Ember.Object.create(item));
          break;
        case 'string':
        case 'number':
          result.pushObject(Ember.Object.create({title:item}));
          break;
        default:
          debug('item of unknown type passed into items array');
      }
    });

    return result;
  },
  /**
   * Mild messaging of the input data given by user through the 'items' property
   */
  content: computed('items.length','items.isDirty','tabindex', function() {
    return this.prepareItems();
  }),
  // FILTER SETTING
  // ------------------
  filter: null,
  _filter: computed('filter', function() {
    const filter = this.get('filter');
    switch(typeOf(filter)) {
      case 'object':
        if(!filter.key || !filter.value) {
          debug('Attempted to set a filter object but did not set key and value properties: ' + JSON.stringify(filter));
          return null;
        }
        break;
      case 'array':
        if(filter.length !== 2) {
          debug('Attempted to set a filter as an array with the wrong number of parameters: ' + JSON.stringify(filter));
          return null;
        }
        break;
      case 'string':
      case 'number':
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
  availableAspectPanes: computed('_aspects','_panes',function() {
    const aspects = a(this.get('_aspects'));
    const panes = a(this.get('_panes'));
    let aspectPanes = [];
    if(aspects && panes) {
      aspects.forEach( aspect => {
        aspectPanes.push(aspect);
        panes.forEach( pane => {
          aspectPanes.push(aspect + capitalize(pane));
        });
      });
    }

    return a(aspectPanes);
  }),
  _itemProperties: null,
  _listProperties: ['size','mood','skin','squeezed'],
  mappedProperties: computed(function() {
    const mapHash = typeOf(this.get('map')) === 'object' ? this.get('map') : {};
    const mapProps = a(keys(this).filter( prop => {
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

    return a(keys(mp).map(item => {
      return mp[item];
    }));
  }),

  actions: {
    onHover() {
      return true;
    }

  },

  /**
   * Keeps track of what properties are set across _items so that _items components can be more
   * conservative on their observer usage
   */
  _itemSetProperties: on('beforeRender',computed('_items', function() {
    const possibleAspectPanes = this.get('availableAspectPanes');
    const mappedFrom = this.get('_mappedFrom');
    let aspectPanes = keys(this.get('mappedProperties'));
    let otherProperties = a();
    this.get('content').forEach( item => {
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
      aspectPanes: a(aspectPanes).uniq(),
      otherProperties: a(otherProperties).uniq()
    };
  })),
  _isMappedProperty: function(prop) {
    const mp = this.get('mappedProperties');
    const mappedFrom = this.get('_mappedFrom');

    return mappedFrom.contains(prop) ? mp[prop] : false;
  }
});

// NAMED FOR EMBER INSPECTOR
UiList[Ember.NAME_KEY] = 'ui-list';
export default UiList;
