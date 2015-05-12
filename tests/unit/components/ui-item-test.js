import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;    // jshint ignore:line

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
  let component = this.subject( {foo: mantra, mapTitle: 'foo'} );
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

test('size, mood, and style private properties set', function(assert) {
  let component = this.subject();
  component.set('size', 'large');
  assert.equal(component.get('_size'), 'large');
  component.set('mood', 'success');
  assert.equal(component.get('_mood'), 'mood-success');
  component.set('style', 'flat');
  assert.equal(component.get('_style'), 'style-flat');
});

test('mood property - static values', function(assert) {
  let component = this.subject({
    title: 'Monkey',
    subHeading: 'who doesn\'t love monkeys?',
    mood: null
  });
  
  this.render();
  run(() => {
    assert.equal(component.get('_mood'),'','null mood should convert to empty string');
    component.set('mood','');
    assert.equal(component.get('_mood'),'','empty string for mood should stay as empty string');
    component.set('mood','foobar');
    assert.equal(component.get('_mood'),'mood-foobar','a string value should have "mood-" prepended to result');
    // CSS/DOM Checks
    let done1 = assert.async();
    let done2 = assert.async();
    run.later( () => {
      assert.ok(this.$().hasClass('mood-foobar'), '"mood-foobar" css class found: [' + this.$().attr('class') + ']' );
      component.set('mood','success');
      done1();
      run.later( () => {
        assert.ok(!this.$().hasClass('mood-foobar'), '"mood-foobar" css class no longer set' );
        assert.ok(this.$().hasClass('mood-success'), '"mood-success" css class found: [' + this.$().attr('class') + ']' );
        done2();  
      },5);
    }, 15);
    
  });
});

test('mood property - function/callback', function(assert) {
  let component = this.subject({
    title: 'Monkey',
    subHeading: 'who doesn\'t love monkeys?',
    mood: function(item) {
      return item.title === "Monkey" ? 'success' : 'warning';
    }
  });
  assert.equal(component.get('_mood'), 'mood-success', 'Mood should have resolved to scalar value');
  component.set('title','Rabbit');
  let done = assert.async();
  run.later( () => {
    assert.equal(component.get('_mood'), 'mood-warning', 'Mood should have re-resolved to new scalar value');
    done();
  }, 5);
});

test('size property - static values', function(assert) {
  let component = this.subject({
    title: 'Monkey',
    subHeading: 'who doesn\'t love monkeys?',
    size: null
  });
  
  this.render();
  run(() => {
    assert.equal(component.get('_size'),'','null size should convert to empty string');
    component.set('size','default');
    assert.equal(component.get('_size'),'','empty string for size should stay as empty string');
    component.set('size','huge');
    assert.equal(component.get('_size'),'huge','a string value should be directly copied across');

    // CSS/DOM Tests
    let done1 = assert.async();
    let done2 = assert.async();
    run.later( () => {
      assert.ok(this.$().hasClass('huge'), '"huge" css class detected');
      component.set('size','small');
      done1();
      run.later( () => {
        assert.ok(!this.$().hasClass('huge'), '"huge" css class removed after switching');
        assert.ok(this.$().hasClass('small'), '"small" css class detected');
        done2();        
      }, 5);
    },5);
	});
  
});
