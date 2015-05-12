import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('ui-item', {
  // Specify the other units that are required for this test
  needs: ['component:ui-icon']
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('mapped property works with local map', function(assert) {
  const mantra = 'To Foo is to Live';
  assert.expect(2);
  let component = this.subject( {foo: mantra, titleMap: 'foo'} );
  this.render();
  assert.equal(component.get('foo'), mantra);
  assert.equal(component.get('title'), mantra);
});

test('mapped property works with map hash', function(assert) {
  const mantra = 'To Foo is to Live';
  assert.expect(2);
  let component = this.subject( {foo: mantra, map: {title: 'foo'} } );
  this.render();
  assert.equal(component.get('foo'), mantra);
  assert.equal(component.get('title'), mantra);
});