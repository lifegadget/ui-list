import Ember from 'ember';
import ListMessagingMixin from 'ui-list/mixins/list-messaging';
import { module, test } from 'qunit';

module('Unit | Mixin | list messaging');

// Replace this with your real tests.
test('it works', function(assert) {
  var ListMessagingObject = Ember.Object.extend(ListMessagingMixin);
  var subject = ListMessagingObject.create();
  assert.ok(subject);
});
