import Ember from 'ember';
import ItemMixin from 'ui-list/mixins/item';
import { module, test } from 'qunit';

module('Unit | Mixin | item');

// Replace this with your real tests.
test('it works', function(assert) {
  let ItemObject = Ember.Object.extend(ItemMixin);
  let subject = ItemObject.create();
  assert.ok(subject);
});
