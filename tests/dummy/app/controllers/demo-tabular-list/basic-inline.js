import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

export default Ember.Controller.extend({
  gaps: 0,
  columnStringDefinition: 'First Name,Last Name,Quantity::number,When::date::toNow',
  basic: [
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'lastName', name:'Last Name', isSortable: true},
    {id:'quantity', name:'Quantity', type:'number', isSortable: true, horizontal: 'right', format: {showCommas: true} },
    {id:'when', name:'When', type:'date', format:'toNow', horizontal: 'center'},
  ]

});
