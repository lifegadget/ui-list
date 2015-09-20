import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line
const capitalize = Ember.String.capitalize;
const camelize = Ember.String.camelize;

import layout from '../templates/components/ui-list';
import ListMessaging from '../mixins/list-messaging';

var UiList = Ember.Component.extend(ListMessaging,{
  classNames: ['ui-list','list-container'],
  classNameBindings: ['compressed','horizontal:horizontal:vertical', '_skin'],
  sortAscending: true,
  layout: layout,
  tagName: 'div',
  tabindex: false,

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
  arrangedContent: computed.alias('content'),
  itemType: computed('type', function() {
    const type = this.get('type');

    return type ? type : 'UiItem';
  }),
  _skin: computed('skin', function() {
    const {skin} = this.getProperties('skin');
    return skin ? `skin-${skin}` : false;
  }),
  mouseEnter(e) {
    this.sendAction('onHover', this, {
      granularity: 'list',
      state: true,
      eventTrigger: 'mouse-enter',
      event: e
    });
    return true;
  },
  mouseLeave(e) {
    this.sendAction('onHover', this, {
      granularity: 'list',
      state: false,
      eventTrigger: 'mouse-leave',
      event: e
    });
    return true;
  },

  type: 'ui-item', // the type of Item contained by this list
  compressed: false, // horizontal space compression between items (provided via CSS),
  prepareItems() {
    let result = new A();
    let items = this.get('items');
    items = typeOf(items) === 'array' ? items : items.split(',');
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
   * Content is immutable copy of _items with the ability to be filtered
   */
  content: computed('items.[]','filter','tabindex', function() {

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

    return new A(aspectPanes);
  }),
  _itemProperties: null,
  _listProperties: ['size','mood','skin','squeezed'],
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
   * Receives messages from register _items
   * @param  {string} action  the action the item is communicating
   * @param  {object} item    reference to the item communicating
   * @param  {Object} options hash of various variables
   * @return {Boolean}
   */
  paneClick(item, options) {
    this.sendAction('onClick', item, options );
  },

  /**
   * Keeps track of what properties are set across _items so that _items components can be more
   * conservative on their observer usage
   */
  _itemSetProperties: on('beforeRender',computed('_items', function() {
    const possibleAspectPanes = this.get('availableAspectPanes');
    const mappedFrom = this.get('_mappedFrom');
    let aspectPanes = keys(this.get('mappedProperties'));
    let otherProperties = new A([]);
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
      aspectPanes: new A(aspectPanes).uniq(),
      otherProperties: new A(otherProperties).uniq()
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
