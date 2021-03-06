import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

export default Ember.Controller.extend({
  navigator: inject.service(),
  subNav: computed.alias('navigator.secondaryRoute'),
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

  statusColumns: [
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'status', name:'Status - f()', class: 'classyFunction'},
    {id:'status', name:'Status - map', class: 'classyMap'}
  ],

});
