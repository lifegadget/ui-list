import Ember from 'ember';
import ddau from 'ui-list/mixins/ddau';
import Immutable from 'immutable';
const { Set } = Immutable; // jshint ignore:line
const { computed, typeOf, get, debug } = Ember;
const takeCsvOrArray = function(things) {
  if(!things) {
    return [];
  }
  return typeOf(things) === 'string' ? things.split(/,\s*/) : things;
};

const createSetFromContainerInput = (value) => {
  if(Set.isSet(value)) { return value; }
  if(typeOf(value) === 'string') { value = value.split(/,\s*/); }
  if(typeOf(value) === 'array') { return new Set(value); }
  if(typeOf(value) === 'undefined') { return new Set(); }

  debug(`The value being converted to a map was of the wrong type [${typeOf(value)}]: ${value}`);
  return new Set();
};

const list = Ember.Mixin.create(ddau, {
  // Generate unique property ID
  id: computed(() => Math.random().toString(36).substr(2, 14)),
  classy: computed('skin', 'size', 'orient', 'valign', 'halign', 'fit', function() {
    const { skin, size, orient, valign, halign, fit, reversed } =
        this.getProperties('skin', 'size', 'orient', 'valign', 'halign', 'fit', 'reversed');
    const orientation = orient === 'vertical' ? 'vertical' : 'horizontal';

    return `ui-list ${skin}-skin ${size}-size orient-${orientation} halign-${halign || 'left'} valign-${valign || 'top'}${fit ? ' fit' : ' fill'}`;
  }),

  // Default Property Values
  size: 'default',
  skin: 'default',
  role: 'list',
  cardinality: '0:1',
  type: 'default',
  orient: 'vertical',
  fit: false,
  selected: null,
  _selected: computed('selected', function() {
    return createSetFromContainerInput(get(this, 'selected'));
  }),
  align: 'center',
  disabled: computed(() => ( [] )),

  // Compose items in consistent format
  _items: computed('items', function() {
    return takeCsvOrArray(this.get('items'));
  }),

  toggleSetProperty( which, id ) {
    const things = get(this, which);
    return things.includes(id) ? things.delete(id) : things.add(id);
  },

  actions: {
    /**
     * onClick
     *
     * When an item passes up a click event the list is reponsible
     * for firing two events:
     *
     * 1) onClick - it will proxy the click event on to the container
     * 2) onSelected - it will suggest a toggling of the item's id in selected array
     */
    onClick(hash) {
      const { id, item } = hash;
      const _selected = this.get('_selected');
      const idValue = Set.isSet(_selected) ? id : id.toArray();
      this.ddau('onClick', {
        id: idValue,
        item,
        list: this
      }, get(item, 'value') || item);

      this.ddau('onSelected', {
        id: idValue,
        item,
        list,
      }, this.toggleSetProperty('_selected', id));
    },
    onHover(isHovering, id) {
      console.log('hover', id, isHovering);
    },
    onFocus(isFocused, id) {
      console.log('focused', id, isFocused);
    },
    onDisabled(id) {
      console.log('disabled', id);
    }
  }

});

list[Ember.NAME_KEY] = 'list-properties';
export default list;
