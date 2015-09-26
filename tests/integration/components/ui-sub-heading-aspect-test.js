import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-sub-heading-aspect', 'Integration | Component | ui sub heading aspect', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui-sub-heading-aspect}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-sub-heading-aspect}}
      template block text
    {{/ui-sub-heading-aspect}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
