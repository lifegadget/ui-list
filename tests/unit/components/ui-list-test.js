import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;    // jshint ignore:line
import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('ui-list', {
  // Specify the other units that are required for this test
  needs: ['component:ui-item','component:ui-icon']
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

test('items are enumerable', function(assert) {
  let component = this.subject();
  assert.ok(component.get('items').firstObject, 'even at initialization state, items should be enumerable');
  component.set('items', [ {when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1} ]);
  assert.ok(component.get('items').firstObject, 'a bare JS array should be fine');
  component.set('items', new A([ {when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1} ]));
  assert.ok(component.get('items').firstObject, 'an ember array passed in is ok');
});

test('items are observable', function(assert) {
  let component = this.subject({ignored: true});
  assert.ok(component.get('items').hasEnumerableObservers, "the items array should be observable");
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"}),
    Ember.Object.create({when: 5, foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"}),
    Ember.Object.create({when: 6, foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}),
    Ember.Object.create({when: 1, foo: "Ate Breakfast", bar: "start of every good morning", icon: "cutlery"})
  ]);
  assert.ok(component.get('items.0').hasObserverFor('foo'), "the foo property should be observed too");
  assert.ok(component.get('items.0').hasObserverFor('bar'), "the bar property should be observed too");
  assert.ok(component.get('items.0').hasObserverFor('badge'), "the badge property should be observed too");
  assert.ok(!component.get('items.0').hasObserverFor('foobar'), "the foobar property does not exist and now observation should");
  assert.ok(!component.hasObserverFor('ignored'), "the ignored property should be ignored because it was created before the object was created");
});

test('only valid filters are settable', function(assert) {
  let component = this.subject();
  component.set('filter', ['when', 6 ]);
  assert.equal(
    JSON.stringify(component.get('_filter')),
    JSON.stringify(['when', 6 ]), 
    'a two element array should be considered valid'
  );
  component.set('filter', ['when', 6, 7 ]); // invalid syntax
  assert.notEqual(
    JSON.stringify(component.get('_filter')),
    JSON.stringify(['when', 6, 7 ]), 
    'a three element array should NOT be considered valid'
  );
  // valid object
  const validObject = {key: 'when', value: 6};
  component.set('filter', validObject); 
  assert.equal(
    JSON.stringify(component.get('_filter')),
    JSON.stringify(validObject), 
    'a valid key/value object should be fine as a filter'
  );
  // invalid object
  const invalidObject = {when: 6};
  component.set('filter', invalidObject); 
  assert.notEqual(
    JSON.stringify(component.get('_filter')),
    JSON.stringify(invalidObject), 
    'an invalid object should be ignored'
  );
  // scalars
  component.set('filter', 'this was a bad idea');
  assert.equal(component.get('_filter'),null, 'a string filter is invalid and ignored');
  component.set('filter', 5);
  assert.equal(component.get('_filter'),null, 'yeah right! a number? come on.');
});

test('content is filtered', function(assert) {
  let component = this.subject();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"}),
    Ember.Object.create({when: 5, foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"}),
    Ember.Object.create({when: 6, foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}),
    Ember.Object.create({when: 1, foo: "Ate Breakfast", bar: "start of every good morning", icon: "cutlery"})
  ]);
  component.set('map', {
    title: 'foo',
    subHeading: 'bar'
  });
  assert.equal(component.get('items').length, 6, 'INIT: all items are loaded without filtering on');
  assert.equal(component.get('content').length, 6, 'INIT: item content has been brought over to content array');
  assert.equal(component.get('arrangedContent').length, 6, 'INIT: content array also residing in arrangeContent');
  component.set('filter', ['icon','cab']);
  assert.equal(component.get('content').length, 1, 'content should have only 1 item in it after filtering');
  assert.equal(component.get('content.0.icon'), 'cab', 'property remaining should be equal to the filtered value');
  component.set('filter', null);
  assert.equal(component.get('content').length, 6, 'content array should have all items once filter has been removed');  
  component.set('filter', { key:'icon', value: 'cab' });
  assert.equal(typeOf(component.get('filter.key')), 'string', 'setting filter with object: {name/value}');
  assert.equal(component.get('content').length, 1, 'content should have only 1 item in it after filtering (w/ object)');
  assert.equal(component.get('content.0.icon'), 'cab', 'property remaining should be equal to the filtered value  (w/ object)');
  component.set('filter', item => { return item.get('badge') > 0; });
  assert.equal(component.get('content').length, 2, 'After filtering with function for items with badges there should be 2 remaining');
  component.set('filter', null);
  assert.equal(component.get('content').length, 6, 'content array should have all items once filter has been removed (again)');  
});

test('content is set from items', function(assert) {
  let component = this.subject();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"}),
    Ember.Object.create({when: 5, foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"}),
    Ember.Object.create({when: 6, foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}),
    Ember.Object.create({when: 1, foo: "Ate Breakfast", bar: "start of every good morning", icon: "cutlery"})
  ]);
  component.set('map', {
    title: 'foo',
    subHeading: 'bar'
  });
  assert.equal(component.get('items').length, component.get('content').length, "content and items should always be equal length");
  // validate simple property transfer
  assert.equal(
    component.get('items.0.foo'), 
    component.get('content.0.foo'), 
    "foo should have been copied over to 'content' array"
  );
  assert.equal(
    component.get('items.0.badge'), 
    component.get('content.0.badge'), 
    "badge should have been copied over to 'content' array"
  );
  // check new bindings
  assert.equal(
    component.get('content.0.foo'), 
    component.get('content.0.title'),
    "title should have taken mapped value from 'foo' and reside in 'content' array"
  );
  assert.equal(
    component.get('content.0.bar'), 
    component.get('content.0.subHeading'),
    "subHeading should have taken mapped value from 'bar' and reside in 'content' array"
  );
    
});

test('test that “packed” object included in content', function(assert) {
  let component = this.subject();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, title: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"})
  ]);
  assert.equal(
    component.get('content.0.packed.title'), 
    component.get('content.0.title'),
    "a mapped title should be in content as well as packed object off of content/item"
  );
  assert.equal(
    component.get('content.1.packed.title'), 
    component.get('content.1.title'),
    "a direct reference to title should be in content as well as packed object off of content/item"
  );
  
});

test('listProperties propagated to items', function(assert) {
  let component = this.subject();
  let done = assert.async();
  let done2 = assert.async();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
  ]);
  this.render();
  run.later(() => {
    component.set('size','large');
    assert.equal(component.get('size'), 'large', 'INIT: size listProperty set to large');
    component.set('style','flat');
    assert.equal(component.get('style'), 'flat', 'INIT: style listProperty set to flat');
    component.set('mood','success');
    assert.equal(component.get('mood'), 'success', 'INIT: mood listProperty set to success');
    done();
    run.later(() => {
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('size') === 'large'; } ).length, 2, 'all items should have size set to large');
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('style') === 'flat'; } ).length, 2, 'all items should have style set to flat');
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('mood') === 'success'; } ).length, 2, 'all items should have mood set to success');
      done2();
    },5);
  },5);


});

test('inline business logic resolved', function(assert) {
  let component = this.subject();
  component.set('items', [
    {
      when: 2, 
      badge: 1,
      badgePlus: function(item) { return item.get('badge') + 1; }
    },
    {
      when: 3, 
      badge: 6,
      badgePlus: function(item) { return item.get('badge') + 1; }
    }
  ]);
  component.set('badgePlus', function(item) {
    return item.badge++;
  });
  assert.equal(
    component.get('content.0.badgePlus'),
    component.get('content.0.badge') + 1, 
    "the badgePlus property should have resolved to a discrete scalar"
  );
});

test('observing a property change in items', function(assert) {
  assert.expect(6);
  var done = assert.async();
    var component = this.subject({
      _propertyChangedCallback: (property) => {
        assert.equal(component.get('content.0.foo'),'Food', "the 'content' array should have the updated value from 'items'");
        assert.equal('foo', property, 'the changed property "foo" was detected');
        this.done = true;
        done(); 
      }
    });
  assert.ok(component._propertyChangedCallback, 'change callback appears to exist');
  assert.equal(typeOf(component._propertyChangedCallback), 'function',  'callback is a valid function');
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6})
  ]);
  assert.equal(component.get('items.0.foo'), 'Groceries', 'initial value of foo is correct');
  component.set('items.0.foo','Food');
  assert.equal(component.get('items.0.foo'), 'Food', 'changed value of foo (in items) is correct');
  var later = run.later( () => {
    if(!this.done) {
      assert.equal(component.get('content.0.foo'),'Food', "the 'content' array should have the updated value from 'items'");
      assert.ok(false,"failed to observe change to 'foo' property");
      done();      
    }
  },50);
});

test('packed and packedProperties  set', function(assert) {
  let component = this.subject({});
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, title: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer"})
  ]);
  component.set('map', {
    title: 'foo',
    subHeading: 'bar'
  });  
  assert.equal(component.get('items').length, 3, "INIT: items array loaded");
  assert.equal(typeOf(component.get('map')), 'object', "INIT: a map hash has been set: " + JSON.stringify(component.get('map')));
    
  assert.equal(component.get('content.0.packed.title'), 'Groceries', 'packed property has mapped title property');
  assert.equal(component.get('content.0.packed.badge'), 1, 'packed property has un-mapped badge property');
  const packedProperties = component.get('content.0.packedProperties');
  assert.ok($(packedProperties).not(['title','subHeading','icon','badge']).length === 0 && $(['title','subHeading','icon','badge']).not(packedProperties).length === 0, 'packedProperties are correct');
});

test('Squeezed property proxied down to items', function(assert) {
  let component = this.subject();
  let done = assert.async();
  let done2 = assert.async();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6})
  ]);
  this.render();
  run.later( () => {
    assert.ok(!component.get('squeezed'), 'INIT: the list component should have squeezed property off');
    assert.equal(component.get('_registeredItems.length'), 2, 'INIT: there should be two items registered in the list');
    console.log('registered: %o', component.get('_registeredItems'));
    assert.equal(component.get('_registeredItems').filter( item => { return item.get('squeezed'); } ).length, 0, 'INIT: neither item should have squeezed turned on');
    component.set('squeezed', true);
    done();
    run.later( () => {
      const results = component.get('_registeredItems').filter( item => { return item.get('squeezed'); } );
      assert.equal(results.length, 2, 'all items should have squeezed turned on');
      console.log('results are: %o', results);
      done2();
    },50);
  },50);
});
