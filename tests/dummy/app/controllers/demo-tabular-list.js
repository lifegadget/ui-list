import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

export default Ember.Controller.extend({

  queryParams: ['mood','size','style','compressed'],
  appointments: computed(function() {
    return this.store.findAll('appointment');
  }),
  basic: [
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'lastName', name:'Last Name', isSortable: true},
    {id:'quantity', name:'Quantity', type:'number', isSortable: true, horizontal: 'right', format: {showCommas: true} },
    {id:'when', name:'When', type:'date', format:'toNow', horizontal: 'center'},
  ],
  advanced: [
    {id:'id', hidden:true},
    {id:'selection', name:'', type:'selection', horizontal: 'center'},
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'lastName', name:'Last Name', isSortable: true},
    {id:'action', name:'Action', type:'buttons', value: ['do-it'], format: {size: 'small', mood:'success', icon: 'arrow-circle-o-right'}, horizontal: 'center'},
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
