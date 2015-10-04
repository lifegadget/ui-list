import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;  // jshint ignore:line
const { defineProperty, get, set, inject, isEmpty, merge } = Ember; // jshint ignore:line
const a = Ember.A; // jshint ignore:line

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-row-item', 'Integration | Component | ui-row-item', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.render(hbs`{{ui-row-item}}`);
  assert.equal(this.$().text().trim(), '');
  // Template block usage:
  this.render(hbs`
    {{#ui-row-item}}
      template block text
    {{/ui-row-item}}
  `);
  assert.equal(this.$().text().trim(), 'template block text');
});

test('columns definition results in column panes', function(assert) {
  // assert.expect(2);
  this.render(hbs`{{ui-row-item columns='one,two,three' one='one' two='two' }}`);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 3, 'three columns should have been produced: ');

});
