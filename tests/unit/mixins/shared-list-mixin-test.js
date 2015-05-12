import Ember from 'ember';
import SharedListMixinMixin from 'ui-list/mixins/shared-list-mixin';
import { module, test } from 'qunit';

module('SharedListMixinMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var SharedListMixinObject = Ember.Object.extend(SharedListMixinMixin);
  var subject = SharedListMixinObject.create();
  assert.ok(subject);
});
