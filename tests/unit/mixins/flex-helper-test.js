import Ember from 'ember';
import FlexHelperMixin from 'ui-list/mixins/flex-helper';
import { module, test } from 'qunit';

module('Unit | Mixin | flex-helper');

// Replace this with your real tests.
test('it works', function(assert) {
  var FlexHelperObject = Ember.Object.extend(FlexHelperMixin);
  var subject = FlexHelperObject.create();
  assert.ok(subject);
});
