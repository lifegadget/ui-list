import Ember from 'ember';
const { keys, create } = Object;  
const { computed, observer, $, run, on, typeOf, debug, isPresent } = Ember;   
const { defineProperty, get, set, inject, isEmpty, merge } = Ember;  
const a = Ember.A;  

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-row-item', 'Integration | Component | ui-row-item', {
  integration: true
});

test('columns definition results in column panes and aspects', function(assert) {
  assert.expect(2);
  this.render(hbs`{{ui-row-item columns='one,two,three' one='one' two='two' }}`);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 3, 'three columns should have been produced');
  assert.equal(this.$('.column .cell').length, 3, 'three cells should have been produced');
});
test('properties without column definition results in column panes and aspects', function(assert) {
  assert.expect(2);
  this.render(hbs`{{ui-row-item one='one' two='two' }}`);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 2, 'two columns should have been produced');
  assert.equal(this.$('.column .cell').length, 2, 'two cells should have been produced');
});
test('detailed columns definition effects pane and aspect creation (inline)', function(assert) {
  // assert.expect(2);
  this.set('myColumns', [
    {id: 'one', type: 'number', precision:2 },
    {id: 'two', type: 'number', precision:1 },
    {id: 'three', type: 'string' }
  ]);
  this.render(hbs`{{ui-row-item columns=myColumns one=1 two=2 three='foo' }}`);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 3, 'three columns should have been produced');
  assert.equal(this.$('.column .cell').length, 3, 'three cells should have been produced');
  assert.ok($(this.$('.column .cell').get(0)).hasClass('number-type'), 'first column is a number');
  assert.equal($(this.$('.column .cell').get(0)).text().trim(), '1.00', 'precision config has adjusted output');
  assert.equal($(this.$('.column .cell').get(1)).text().trim(), '2.0', 'precision config has adjusted output');
  assert.ok($(this.$('.column .cell').get(2)).hasClass('string-type'), 'last column is a string');
});
test('detailed columns definition effects pane and aspect creation (block)', function(assert) {
  // assert.expect(2);
  this.set('myColumns', [
    {id: 'one', type: 'number', precision:2 },
    {id: 'two', type: 'number', precision:1 },
    {id: 'three', type: 'string' }
  ]);
  this.render(hbs`
    {{#ui-row-item
      columns=myColumns
      one=1
      two=2
      three='foo'
      as |row|
    }}
    {{#each row._columns as |column|}}
      {{ui-column-pane row=row column=column}}
    {{/each}}
    {{/ui-row-item}}
  `);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 3, 'three columns should have been produced');
  console.log('values: %o', this.$('.cell').text());
  assert.equal(this.$('.cell').length, 3, 'three cells should have been produced');
  assert.ok($(this.$('.cell').get(0)).hasClass('number-type'), 'first column is a number');
  assert.equal($(this.$('.cell').get(0)).text().trim(), '1.00', 'precision config has adjusted output');
  assert.equal($(this.$('.cell').get(1)).text().trim(), '2.0', 'precision config has adjusted output');
  assert.ok($(this.$('.cell').get(2)).hasClass('string-type'), 'last column is a string');
});
test('detailed columns definition effects pane and aspect creation (block-block)', function(assert) {
  // assert.expect(2);
  this.set('myColumns', [
    {id: 'one', type: 'number', precision:2 },
    {id: 'two', type: 'number', precision:1 },
    {id: 'three', type: 'string' }
  ]);
  this.render(hbs`
    {{#ui-row-item
      columns=myColumns
      one=1
      two=2
      three='foo'
      as |row|
    }}
    {{#each row._columns as |column|}}
      {{#ui-column-pane row=row column=column as |pane|}}
        {{ui-cell-aspect pane=pane}}
      {{/ui-column-pane}}
    {{/each}}
    {{/ui-row-item}}
  `);
  // inline test of simple string definition
  assert.equal(this.$('.column').length, 3, 'three columns should have been produced');
  console.log('values: %o', this.$('.cell').text());
  assert.equal(this.$('.cell').length, 3, 'three cells should have been produced');
  assert.ok($(this.$('.cell').get(0)).hasClass('number-type'), 'first column is a number');
  assert.equal($(this.$('.cell').get(0)).text().trim(), '1.00', 'precision config has adjusted output');
  assert.equal($(this.$('.cell').get(1)).text().trim(), '2.0', 'precision config has adjusted output');
  assert.ok($(this.$('.cell').get(2)).hasClass('string-type'), 'last column is a string');
});
