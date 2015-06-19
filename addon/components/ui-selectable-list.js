import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';

export default UiList.extend({
  layout: layout,
  selected: null,
  /**
   * Receives messages from register items
   * @param  {string} action  the action the item is communicating
   * @param  {object} item    reference to the item communicating
   * @param  {Object} options hash of various variables
   * @return {Boolean}
   */
  _itemListener: function(action, item, options={}) {
    this.sendAction('action', action, options);
    console.log('itemListener: %s', action);
    if(action === 'paneClick') {
      const selected = this.get('selected');
      if(selected) {
        selected.set('selected', false);
      }
      this.set('selected', item);
      item.set('selected', true);
      this.sendAction('onSelected', item, options);
    }

    return true;
  }
});
