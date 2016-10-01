import Ember from 'ember';
import ListMixin from 'ui-list/mixins/list';
import { module, test } from 'qunit';

module('Unit | Mixin | list');

// Replace this with your real tests.
test('it works', function(assert) {
  let ListObject = Ember.Object.extend(ListMixin);
  let subject = ListObject.create();
  assert.ok(subject);
});
