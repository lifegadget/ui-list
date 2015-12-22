import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

const classyFunction = function (context) {
  if(get(context,'value').substr(-3) === 'ing') {
    return 'label label-warning';
  } else {
    return 'label label-success';
  }
};
const classyMap = {
  executed: 'label label-success',
  verifying: 'label label-warning',
  executing: 'label label-danger'
};

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
  ],
  statusColumns: [
    {id:'firstName', name:'First Name', isSortable: true},
    {id:'status', name:'Status - f()', class:classyFunction},
    {id:'status', name:'Status - map', class:classyMap}
  ],


  actions: {
    navSubMenu(o) {
      if(o.type === 'selection') {
        this.transitionToRoute(`demo-tabular-list.${o.selected}`);
      }
    }
  }

});
