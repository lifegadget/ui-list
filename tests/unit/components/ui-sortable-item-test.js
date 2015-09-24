import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line

import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ui-sortable-item', 'Unit | Component | ui sortable item', {
  // Specify the other units that are required for this test
  needs: ['component:ui-aspect-handle', 'component:ui-icon'],
  unit: true
});

test('it renders', function(assert) {
  run(()=>{
    assert.expect(2);

    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });
});
