import Ember from 'ember';
const { computed } = Ember;

const list = Ember.Mixin.create({
  // Generate unique property ID
  id: computed(() => Math.random().toString(36).substr(2, 14)),
  classy: computed('skin', 'size', 'orientation', function() {
    const { skin, size, orientation } = this.getProperties('skin', 'size', 'orientation');
    return `ui-list ${skin}-skin ${size}-size orient-${orientation}`;
  }),

  // Default Property Values
  size: 'default',
  skin: 'default',
  role: 'list',
  cardinality: '0:1',
  type: 'default',
  orientation: 'vertical',
  orient: computed.alias('orientation'),
  selected: computed(() => ( [] )),
  disabled: computed(() => ( [] )),

  // Compose items in consistent format
  _items: computed('items', function() {
    return Ember.typeOf(this.get('items')) === 'array' ? this.get('items') : this.get('items').split(/,\s*/);
  }),

  actions: {
    onSelected(isSelected, id) {
      console.log('selected', id, isSelected);
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
