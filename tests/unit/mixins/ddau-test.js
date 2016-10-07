import Ember from 'ember';
import DdauMixin from 'ui-list/mixins/ddau';
import { module, test } from 'qunit';

module('Unit | Mixin | ddau');

// Replace this with your real tests.
test('it works', function(assert) {
  let DdauObject = Ember.Object.extend(DdauMixin);
  let subject = DdauObject.create();
  assert.ok(subject);
});
