import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import layout from '../templates/components/ui-tabular-list';
import UiList from 'ui-list/components/ui-list';

export default UiList.extend({
  layout: layout,
  rows: computed.alias('items'),
  classNames: ['table'],

  header: true,

});
