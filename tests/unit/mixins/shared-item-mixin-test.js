import Ember from 'ember';
import SharedItemMixinMixin from '../../../mixins/shared-item-mixin';
import { module, test } from 'qunit';

module('SharedItemMixinMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SharedItemMixinObject = Ember.Object.extend(SharedItemMixinMixin);
  var subject = SharedItemMixinObject.create();
  assert.ok(subject);
});
