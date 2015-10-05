import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line


export default Ember.Controller.extend({

  queryParams: ['mood','size','style','compressed'],
  appointments: computed(function() {
    return this.store.findAll('appointment');
  }),
  columns: [
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'lastName', name:'Last Name', isSortable: true},
    {id:'when', name:'When', type:'date', format:'toNow', horizontal: 'center'}
  ],

  actions: {
    onChange(info) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`onChange event[${info.action}]: ${info.message}`);
    },
    onClick(info) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.info(`onClick event: ${info.message}`);
    },
    onHover(info) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.warning(`onHover event: ${info.eventSource} ${info.message}`);
    }
  }

});
