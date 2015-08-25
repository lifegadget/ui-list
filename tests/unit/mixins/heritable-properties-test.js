import Ember from 'ember';
import HeritablePropertiesMixin from 'ui-list/mixins/heritable-properties';
import { module, test } from 'qunit';

module('Unit | Mixin | heritable properties');

// Replace this with your real tests.
test('it works', function(assert) {
  var HeritablePropertiesObject = Ember.Object.extend(HeritablePropertiesMixin);
  var subject = HeritablePropertiesObject.create();
  assert.ok(subject);
});
