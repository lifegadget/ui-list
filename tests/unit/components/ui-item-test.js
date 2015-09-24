import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;    // jshint ignore:line

import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('ui-item', 'Unit | Component | ui-item', {
  needs: ['component:ui-icon','component:ui-image','component:ui-pane'],
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);
  run(()=>{
    // Creates the component instance
    var component = this.subject();
    assert.equal(component._state, 'preRender');

    // Renders the component to the page
    this.render();
    assert.equal(component._state, 'inDOM');
  });
});

test('mapped property works with local map', function(assert) {
  run(()=>{
    const mantra = 'To Foo is to Live';
    assert.expect(2);
    let component = this.subject( {foo: mantra, mapTitle: 'foo'} );
    this.render();
    assert.equal(component.get('foo'), mantra);
    assert.equal(component.get('title'), mantra);
  });
});

test('mapped property works with map hash', function(assert) {
  run(()=>{
    const mantra = 'To Foo is to Live';
    assert.expect(2);
    let component = this.subject( {foo: mantra, map: {title: 'foo'} } );
    this.render();
    assert.equal(component.get('foo'), mantra);
    assert.equal(component.get('title'), mantra);
  });
});

test('size, mood, and skin private properties set', function(assert) {
  run(()=>{
    let component = this.subject();
    component.set('size', 'large');
    assert.equal(component.get('_size'), 'large');
    component.set('mood', 'success');
    assert.equal(component.get('_mood'), 'mood-success');
    component.set('skin', 'flat');
    assert.equal(component.get('_skin'), 'skin-flat');
  });
});

test('mood property - static values', function(assert) {
  run(() => {
  let component = this.subject({
    title: 'Monkey',
    subHeading: 'who doesn\'t love monkeys?',
    mood: null
  });

  this.render();
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
  run(()=>{
    let component = this.subject({
      title: 'Monkey',
      subHeading: 'who doesn\'t love monkeys?',
      mood: function(item) {
        return item.get('title') === "Monkey" ? 'success' : 'warning';
      }
    });
    assert.equal(component.get('_mood'), 'mood-success', '_mood should have resolved to scalar value');
    component.set('title','Rabbit');
    let done = assert.async();
    run.later( () => {
      assert.equal(component.get('_mood'), 'mood-warning', '_mood should have re-resolved to new scalar value');
      done();
    }, 5);
  });

});

test('size property - static values', function(assert) {
  run(() => {
    let component = this.subject({
      title: 'Monkey',
      subHeading: 'who doesn\'t love monkeys?',
      size: null
    });

    this.render();
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

test('size property - function/callback', function(assert) {
  run(()=>{
    let component = this.subject({
      title: 'Size Matters',
      size: function(item) {
        return item.get('title') === "Size Matters" ? 'huge' : 'small';
      }
    });
    assert.equal(component.get('_size'), 'huge', 'Mood should have resolved to scalar value');
    component.set('title','Perfection comes in all shapes and sizes');
    let done = assert.async();
    run.later( () => {
      assert.equal(component.get('_size'), 'small', 'Mood should have re-resolved to new scalar value');
      done();
    }, 5);
  });
});

test('unpacking the data property', function(assert) {
  run(()=>{
    let component = this.subject({
      data: {
        title: 'Tiger',
        subHeading: 'angry lion-like prowler',
        badge: 8,
        icon: 'check-square-o'
      }
    });
    assert.equal(component.get('title'), 'Tiger', 'title unpacked');
    assert.equal(component.get('subHeading'), 'angry lion-like prowler', 'subHeading unpacked');
    assert.equal(component.get('badge'), 8, 'badge unpacked');
    assert.equal(component.get('icon'), 'check-square-o', 'icon unpacked');
  });
});

test('default values', function(assert) {
  run(()=>{
    let component = this.subject({
      defaultTitle: 'Insert Title',
      defaultIconCenter: 'check-square-o',
      defaultSubHeading: 'nada',
      subHeading: 'something'
    });
    assert.equal( component.get('titleCenter'), 'Insert Title', 'when no titleCenter set, default value should take its place');
    assert.equal( component.get('title'), 'Insert Title', 'when no title set, default value should take its place (aliased)');
    component.set('titleCenter', 'My Title');
    assert.equal( component.get('title'), 'My Title', 'once Title is set, it overrides default value.');
    assert.equal( component.get('iconCenter'), 'check-square-o', 'when no iconCenter is set, default value should be ignored');
    component.set('iconCenter', 'envelope');
    assert.equal( component.get('iconCenter'), 'envelope', 'once iconCenter is set, default value should be replaced');
    assert.equal( component.get('subHeading'), 'something', 'when subHeading has a value, default should be ignored');
    assert.equal( component.get('subHeadingCenter'), 'something', 'when subHeading\'s alias subHeadingCenter has a value, default should be ignored');
  });

});

test('test logic panes', function(assert) {
  run(()=>{
    let component = this.subject({
      iconRight: 'chevron-right'
    });
    assert.equal( component.get('hasLeftPane') ? true:false, false, 'when no properties set, left pane should be false');
    assert.equal( component.get('hasCenterPane') ? true:false, false, 'when no properties set, center pane should be false');
    assert.equal( component.get('hasRightPane') ? true:false, true, 'when no properties set, right pane should be true because of passed in value');
    component.set('icon','message');
    assert.equal( component.get('hasLeftPane') ? true : false, true, 'icon set which is aliased to left pane; should now be true');
  });
});

test('test squeezed CSS toggle', function(assert) {
  run(()=>{
    let component = this.subject();
    let done1 = assert.async();
    let done2 = assert.async();
    this.render();
    run.later( () => {
      assert.equal( component.$().hasClass('squeezed'), false, 'squeezed property is off by default');
      done1();
      component.set('squeezed', true);
      run.later( () => {
        assert.equal( component.$().hasClass('squeezed'), true, 'squeezed property is toggled on with the item property');
        done2();
      },5);
    }, 5);
  });
});
