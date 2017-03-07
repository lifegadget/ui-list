import Ember from 'ember';   
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

const UiSelectableList = UiList.extend({
  layout: layout,
  selectionProperty: 'id',
  selected: [],
  value: computed.alias('selected'),
  /**
   * Will keep ensure that all registered items 'selected' state is in-line with the list's 'selected' array.
   * Also sets '_selected' as an Ember array of 'selected' (useful for containment checks)
   */
  _selectedObserver: on('didInsertElement',observer('selected', function() {
    let {selectionProperty, selected} = this.getProperties('selectionProperty', 'selected');
    selected = typeOf(selected) === 'array' ? a(selected) : a([selected]);
    run.schedule('afterRender', () => {
      this._getRegistryItems().map(item => {
        if ( selected.includes(item.get(selectionProperty)) ) {
          item.set('selected', true);
        } else {
          item.set('selected', false);
        }
      });
      this.set('_selected', selected);
    });
  })),
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
      const {min,max,_selected,selectionProperty} = this.getProperties('min','max','_selected','selectionProperty');
      const item = options.item;
      const itemId = item.get(selectionProperty);
      const itemSelected = item.get('selected');
      let wasSuccessful = false;
      let selection;

      // deselect
      if(itemSelected) {
        // min error
        if( _selected.length - 1 < min ) {
          this.sendAction('onError', {
            type: 'selection',
            code: 'deselect-min-constraint',
            message: `attempted to remove "${get(item, 'title')}" but this list must have at least ${min} items.`,
            min: min,
            selected: _selected,
            item: item,
            id: itemId,
          });
        }
        // valid
        else {
          selection = a(_selected.slice(0)).removeObject(itemId);
          wasSuccessful = true;
          this.sendAction('onChange', {
            type: 'selection',
            action: 'de-select',
            message: `removed "${item.get('title')}" from the selection (${selection.length} items remain)`,
            removed: item,
            id: itemId,
            selected: selection
          });
        }
      }
      // toggle
      else if(max === 1 && _selected.length + 1 > max) {
        const oldSelected = this._findInRegistry('id',_selected[0]);
        this.sendAction('onChange', {
          type: 'selection',
          action: 'toggle',
          message: `toggled from "${get(oldSelected, 'title')}" to "${get(item, 'title')}"`,
          added: item,
          removed: oldSelected,
          selected: a([itemId])
        });
      }
      // select
      else {
        // max error
        if( _selected.length + 1 > max ) {
          this.sendAction('onError', {
            type: 'selection',
            code: 'select-max-constraint',
            message: `attempted to add "${get(item, 'title')}" but this list can only have a maximum of ${max} items.`,
            max: max,
            selected: _selected,
            item: item,
            id: itemId,
          });
        }
        // valid selection
        else {
          wasSuccessful=true;
          selection = a(_selected.slice(0)).addObject(itemId);
          this.sendAction('onChange', {
            type: 'selection',
            action: 'select',
            message: `added "${get(item,'title')}" to the selection (${selection.length} items selected)`,
            added: item,
            id: itemId,
            selected: selection
          });
        }
      }

      return wasSuccessful;
    },
  }, // end _messages
});

UiSelectableList[Ember.NAME_KEY] = 'ui-selectable-list';
export default UiSelectableList;
