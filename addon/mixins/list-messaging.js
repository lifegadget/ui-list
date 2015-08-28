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
      const elementId = item.get('elementId');
      const registeredItems = this.get('_registeredItems');
      // TODO: this conditional check shouldn't really be needed but without it everything gets registered twice for some reason
      const registeredIds = new A(registeredItems.mapBy('elementId'));
      if(!registeredIds.contains(elementId)) {
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
    /**
     * Finds the first item in the list that has a matching 'elementId' property
     * @param  {string} id the elementId to look for
     * @return {object}    the record which matches or null if no match
     */
    findRegisteredItem(id) {
      const item = this.get('_registeredItems').filter( item => {
        return get(item, 'elementId') === id;
      });
      return item ? item[0] : null;
    },
});

ListMessaging[Ember.NAME_KEY] = 'List Messaging';
export default ListMessaging;
