import Ember from 'ember';
import SortableListMixin from '../../../mixins/sortable-list';
import { module, test } from 'qunit';

module('Unit | Mixin | sortable list');

// Replace this with your real tests.
test('it works', function(assert) {
  var SortableListObject = Ember.Object.extend(SortableListMixin);
  var subject = SortableListObject.create();
  assert.ok(subject);
});
