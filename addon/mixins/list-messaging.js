import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

const ListMessaging = Ember.Mixin.create({
    // REGISTRATION
    // ----------------------------------
    _registeredItems: computed(function() {
      return new A([]);
    }),
    register: function(item) {
      const registeredItems = this.get('_registeredItems');
      // TODO: this conditional check shouldn't really be needed but without it everything gets registered twice for some reason
      const registeredIds = new A(registeredItems.mapBy('elementId'));
      if(!registeredIds.contains(get(item,'elementId'))) {
        registeredItems.pushObject(item);
      }
      // on first registered item, ask for meta information from item type
      if(registeredItems.length === 1) {
        this.set('_aspects', item.get('_aspects'));
        this.set('_panes', item.get('_panes'));
      }
    },
    deregister: function(item) {
      const registeredItems = this.get('_registeredItems');
      registeredItems.removeObject(item);
    },
    findRegisteredItem(id) {
      return this.get('_registeredItems').filter( item => {
        return get(item, 'elementId') === id;
      });
    },

    /**
     * Receives actions from items it is managing
     */
    _itemListener: function(action, item, options={}) {
      this.sendAction('action', action, options);

      return true;
    }
});

ListMessaging[Ember.NAME_KEY] = 'List Messaging';
export default ListMessaging;