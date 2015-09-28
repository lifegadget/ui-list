import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('ui-list', 'Integration | Component | ui-list', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{ui-list}}
  `);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-list}}
      template block text
    {{/ui-list}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('inline items rendered', function(assert) {
  assert.expect(2);

  this.set('items', [
    {title: 'one', subHeading: 'sub-text'},
    {title: 'two', subHeading: 'sub-text'}
  ]);
  this.set('registered', new Ember.A([]));

  this.render(hbs`
    {{ui-list items=items _registry=registered}}
  `);

  assert.equal(this.$('.item').length, 2, 'two items should exist');
  assert.equal(this.get('registered').length, 2, 'two registered items in the list container');
});
