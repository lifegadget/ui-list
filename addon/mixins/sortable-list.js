import Ember from 'ember';
const {
  computed, observer, $, A, run, on, typeOf, debug, ObjectProxy, // jshint ignore:line
  defineProperty, keys, get, set, inject, isEmpty                // jshint ignore:line
} = Ember;
const NO_MODEL = {};
const a = A;
export default Ember.Mixin.create({
  /**
    Vertical position for the first item.

    @property itemPosition
    @type Number
  */
  itemPosition: computed({
    get() {
      let element = this.element;
      let stooge = $('<span style="position: absolute" />');
      let result = stooge.prependTo(element).position().top;

      stooge.remove();

      return result;
    }
  }).volatile(),

  /**
    @property sortedItems
    @type Array
  */
  sortedItems: computed('items.@each.y', {
    get() {
      return a(this.get('items')).sortBy('y');
    }
  }),

  /**
    Prepare for sorting.
    Main purpose is to stash the current itemPosition so
    we don’t incur expensive re-layouts.

    @method prepare
  */
  prepare() {
    this._itemPosition = this.get('itemPosition');
  },

  /**
    Update item positions.

    @method update
  */
  update() {
    let sortedItems = this.get('sortedItems');
    let y = this._itemPosition;

    // Just in case we haven’t called prepare first.
    if (y === undefined) {
      y = this.get('itemPosition');
    }

    sortedItems.forEach(item => {
      if (!get(item, 'isDragging')) {
        set(item, 'y', y);
      }
      y += get(item, 'height');
    });
  },

  /**
    @method commit
  */
  commit() {
    let items = this.get('sortedItems');
    let groupModel = this.get('model');
    let itemModels = items.mapBy('model');

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
      this.sendAction('onChange', groupModel, itemModels);
    } else {
      this.sendAction('onChange', itemModels);
    }
  }
});
