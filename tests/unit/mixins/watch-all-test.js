import Ember from 'ember';
import WatchAllMixin from '../../../mixins/watch-all';
import { module, test } from 'qunit';

module('WatchAllMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var WatchAllObject = Ember.Object.extend(WatchAllMixin);
  var subject = WatchAllObject.create();
  assert.ok(subject);
});
