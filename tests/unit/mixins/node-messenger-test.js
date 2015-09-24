import Ember from 'ember';
import NodeMessengerMixin from 'ui-list/mixins/node-messenger';
import { module, test } from 'qunit';

module('Unit | Mixin | node-messenger');

// Replace this with your real tests.
test('it works', function(assert) {
  var NodeMessengerObject = Ember.Object.extend(NodeMessengerMixin);
  var subject = NodeMessengerObject.create();
  assert.ok(subject);
});
