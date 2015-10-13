import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

const ListMessaging = Ember.Mixin.create({

    eventPropagation(event, item, ...args) {
      this.sendAction(event, item, ...args);
    }
});

ListMessaging[Ember.NAME_KEY] = 'List Messaging';
export default ListMessaging;
