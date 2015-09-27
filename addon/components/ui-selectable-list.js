import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default UiList.extend({
  layout: layout,
  _selected: [],
  // TODO: look into why we need to reset this at INIT!
  // it was maintaining values when re-routing to the page which contained the component
  _selectedInitiator: on('init', function() {
    this._selected = [];
  }),
  min: 0,
  max: 1,
  _messages: {
    /**
     * Receives click events from the ui-list ecosystem
     *
     * @param  {Object} options             hash of various variables, which includes ...
     * @param  {Array}  options.curriedBy   an array of components which were involved in the action bubbling
     * @param  {String} options.granularity at which level in the comp hierarchy did event originate (e.g., list, item, etc)
     * @param  {String} options.eventSource the originating jquery event (e.g., 'mouse-down', etc.)
     * @param  {String} options.itemTitle   the title of the item which participated in the click bubbling
     * @param  {Object} options.item        reference to the item object
     * @param  {Object} options.pane        reference to the pane object (if it was involved in event chain)
     * @param  {Object} options.aspect      reference to the aspect object (if it was involved in event chain)
     * @return {Boolean}
     */
    onClick(options) {
      const item = options.item;
      const {min,max} = this.getProperties('min','max');
      const selected = a(this.get('_selected'));
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
          const oldSelected = selected.length > 0 ? this._findInRegistry(selected[0]) : null;
          if(oldSelected) {
            this.deselectItem(oldSelected);
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

      return true;
    },
  },
  selectItem(item) {
    const id = get(item,'elementId');
    set(item,'selected', true);
    this._selected.push(id);
    this.sendAction('onChange', 'selected', item, {
      selected: this._selected
    });
  },
  deselectItem(item) {
    const id = get(item,'elementId');
    set(item,'selected', false);
    this._selected = this._selected.removeObject(id);
    this.sendAction('onChange', 'deselected', item, {
      selected: this._selected
    });
  }
});
