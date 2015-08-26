import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default UiList.extend({
  layout: layout,
  _selected: [],
  min: 0,
  max: 1,
  /**
   * Receives messages from register items
   * @param  {string} action  the action the item is communicating
   * @param  {object} item    reference to the item communicating
   * @param  {Object} options hash of various variables
   * @return {Boolean}
   */
  _itemListener: function(action, item) {
    if(action === 'paneClick') {
      const {min,max} = this.getProperties('min','max');
      const selected = new A(this.get('_selected'));
      const itemSelected = item.get('selected');
      // deselection attempt
      if(itemSelected && selected.contains(item.elementId)) {
        if(selected.length - min > 0) {
          this.deselectItem(item);
        } else {
          this.sendAction('onError', 'deselect-min-constraint', item );
        }
      }
      // selection attempt
      else if(!itemSelected && !selected.contains(item.elementId)) {
        // round-robin selected items
        if(max === 1) {
          const oldSelected = selected.length > 0 ? this.findRegisteredItem(selected[0]) : null;
          if(oldSelected) {
            this.deselectItem(oldSelected[0]);
          }
          this.selectItem(item);
        }
        // round-robin is not applicable
        else {
          if(selected.length + 1 > max) {
            this.sendAction('onError', 'deselect-max-constraint', item );
          } else {
            this.selectItem(item);
          }
        }
      }
    }

    return true;
  },
  selectItem(item) {
    const id = get(item,'elementId');
    set(item,'selected', true);
    this._selected.push(id);
    this.sendAction('onSelect', 'selected', item, {
      selected: this._selected
    });
  },
  deselectItem(item) {
    const id = get(item,'elementId');
    set(item,'selected', false);
    this._selected = this._selected.filter(i => {
      return i !== id;
    });
    this.sendAction('onSelect', 'deselected', item, {
      selected: this._selected
    });
  }
});
