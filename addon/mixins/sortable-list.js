import Ember from 'ember';
const { computed, $, A, run, defineProperty, get, set, inject, isEmpty } = Ember;                // jshint ignore:line
const NO_MODEL = {};
const a = A;
export default Ember.Mixin.create({
  /**
    @property direction
    @type string
    @default y
  */
  direction: 'y',

  /**
    @property model
    @type Any
    @default null
  */
  model: NO_MODEL,

  /**
    @property items
    @type Ember.NativeArray
  */
  items: computed(() => a()),

  /**
    Position for the first item.
    @property itemPosition
    @type Number
  */
  itemPosition: computed(function() {
    let direction = this.get('direction');
    return this.get(`sortedItems.firstObject.${direction}`);
  }).volatile(),

  /**
    @property sortedItems
    @type Array
  */
  sortedItems: computed(function() {
    let items = a(this.get('_registeredItems'));
    let direction = this.get('direction');

    return items.sortBy(direction);
  }).volatile(),

  /**
    Prepare for sorting.
    Main purpose is to stash the current itemPosition so
    we don’t incur expensive re-layouts.
    @method prepare
  */
  prepare() {
    this._itemPosition = this.get('itemPosition');
    console.log('preparing: %o', this._itemPosition);
  },

  /**
    Update item positions.
    @method update
  */
  update() {
    let sortedItems = this.get('sortedItems');
    let position = this._itemPosition;

    // Just in case we haven’t called prepare first.
    if (position === undefined) {
      position = this.get('itemPosition');
    }

    sortedItems.forEach(item => {
      let dimension;
      let direction = this.get('direction');

      if (!get(item, 'isDragging')) {
        set(item, direction, position);
      }

      if (direction === 'x') {
        dimension = 'width';
      }
      if (direction === 'y') {
        dimension = 'height';
      }

      position += get(item, dimension);
    });
  },

  /**
    @method commit
  */
  commit() {
    let items = this.get('sortedItems');
    let groupModel = this.get('_registeredItems');
    let itemModels = items.mapBy('data');
    let draggedItem = items.findBy('wasDropped', true);
    console.log('commit %o into group: %o', draggedItem, groupModel);
    let draggedModel;

    if (draggedItem) {
      set(draggedItem, 'wasDropped', false); // Reset
      draggedModel = get(draggedItem, 'data');
    }

    delete this._itemPosition;

    run.schedule('render', () => {
      items.invoke('freeze');
    });

    run.schedule('afterRender', () => {
      items.invoke('reset');
    });

    run.next(() => {
      run.schedule('render', () => {
        items.invoke('thaw');
      });
    });

    if (groupModel !== NO_MODEL) {
      this.sendAction('onChange', groupModel, itemModels, draggedModel);
    } else {
      this.sendAction('onChange', itemModels, draggedModel);
    }
  }
});
