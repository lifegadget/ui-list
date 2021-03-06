import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

export default Ember.Controller.extend({

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
  ]

});
