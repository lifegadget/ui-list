import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-cell-aspect', 'Integration | Component | ui cell aspect', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui-cell-aspect}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-cell-aspect}}
      template block text
    {{/ui-cell-aspect}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
