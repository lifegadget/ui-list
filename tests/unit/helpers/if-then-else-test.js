import { ifThenElse } from '../../../helpers/if-then-else';
import { module, test } from 'qunit';

module('Unit | Helper | if-then-else');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = ifThenElse([true,'foo','bar']);
  assert.equal(result, 'foo');
  result = ifThenElse([false,'foo','bar']);
  assert.equal(result, 'bar');
});
