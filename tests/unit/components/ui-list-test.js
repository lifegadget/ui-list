import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug, keys } = Ember;    // jshint ignore:line
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
  assert.equal(
    component.get('items.1.icon'),
    component.get('content.1.icon'),
    "icon should have been copied over to 'content' array"
  );
});

test('mappedProperties set from map hash', function(assert) {
  let component = this.subject();
  let initialMap = {
    title: 'foo',
    subHeading: 'bar'
  };
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", walk: true})
  ]);
  component.set('map', initialMap);
  assert.equal(component.get('mappedProperties'), initialMap, 'mapped properties are setup on initialization of map property');
  let mappedFrom = component.get('_mappedFrom');
  assert.equal(mappedFrom.length, 2, '_mappedFrom is correct length');
  assert.ok(mappedFrom.contains('foo'), '_mappedFrom contains foo');
  assert.ok(mappedFrom.contains('bar'), '_mappedFrom contains bar');
});

test('mappedProperties set only with map properties', function(assert) {
  let component = this.subject({
    mapTitle: 'foo',
    mapSubHeading: 'bar'
  });
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", walk: true})
  ]);
  assert.equal(component.get('mappedProperties.title'), 'foo', 'foo map setup map property');
  assert.equal(component.get('mappedProperties.subHeading'), 'bar', 'bar map setup map property');
  // NOTE: this stupid form of testing is based on QUnit doing some pretty odd things right now with testing the array in more direct fashion. Annoying!
  let mappedFrom = component.get('_mappedFrom');
  assert.equal(mappedFrom.length, 2, '_mappedFrom is correct length');
  assert.ok(mappedFrom.contains('foo'), '_mappedFrom contains foo');
  assert.ok(mappedFrom.contains('bar'), '_mappedFrom contains bar');
});

test('mappedProperties with combined map property and map hash', function(assert) {
  let component = this.subject({
    mapSilly: 'walk'
  });
  let initialMap = {
    title: 'foo',
    subHeading: 'bar'
  };
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", walk: true})
  ]);
  component.set('map', initialMap);
  assert.equal(component.get('mappedProperties.title'), 'foo', 'foo map setup map property');
  assert.equal(component.get('mappedProperties.subHeading'), 'bar', 'bar map setup map property');
  assert.equal(component.get('mappedProperties.silly'), 'walk', 'silly map setup map property');
  // NOTE: this stupid form of testing is based on QUnit doing some pretty odd things right now with testing the array in more direct fashion. Annoying!
  let mappedFrom = component.get('_mappedFrom');
  assert.equal(mappedFrom.length, 3, '_mappedFrom is correct length');
  assert.ok(mappedFrom.contains('foo'), '_mappedFrom contains foo');
  assert.ok(mappedFrom.contains('bar'), '_mappedFrom contains bar');
  assert.ok(mappedFrom.contains('walk'), '_mappedFrom contains walk');
});


test('availableAspectPanes is set', function(assert) {
  let component = this.subject();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, title: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", silly: true})
  ]);
  component.set('map', {
    title: 'foo',
    subHeading: 'bar'
  });
  const aspectPanes = new A(component.get('availableAspectPanes'));
  assert.ok(aspectPanes.contains('iconRight'), 'iconRight should be set by default');
  assert.ok(aspectPanes.contains('title'), 'title should be set by default');
  assert.ok(aspectPanes.contains('subHeading'), 'subHeading should be set by default');
});

test('listProperties propagated to items', function(assert) {
  let component = this.subject();
  let done = assert.async();
  let done2 = assert.async();
  let items = [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
  ];
  component.set('items', items);
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
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('size') === 'large'; } ).length, items.length, 'all items should have size set to large');
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('style') === 'flat'; } ).length, items.length, 'all items should have style set to flat');
      assert.equal(component.get('_registeredItems').filter( item => { return item.get('mood') === 'success'; } ).length, items.length, 'all items should have mood set to success');
      done2();
    },5);
  },5);
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
    assert.equal(component.get('_registeredItems').filter( item => { return item.get('squeezed'); } ).length, 0, 'INIT: neither item should have squeezed turned on');
    component.set('squeezed', true);
    done();
    run.later( () => {
      const results = component.get('_registeredItems').filter( item => { return item.get('squeezed'); } );
      assert.equal(results.length, 2, 'all items should have squeezed turned on');
      done2();
    },25);
  },25);
});

test('Items are registered, mapped and appear in DOM', function(assert) {
  let component = this.subject({
    map: {
     title: 'foo'
    },
    mapSubHeading: 'bar'
  });
  let done = assert.async();
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", walk: true})
  ]);
  this.render();
  run.later( () => {
    // sanity tests on registered items
    assert.equal(component.get('_registeredItems.length'), 3, 'there should be three item components which have registered themselves.');
    let foey = component.get('_registeredItems').map(item=>{ return item.get('foo');});
    let arrangedFoey = new A(component.get('arrangedContent').map(item=>{ return item.get('foo');}));
    assert.ok(
      foey.every(item => { return arrangedFoey.contains(item);} ),
      'Foo properties were equivalent between list\'s arrangedContent and the registered item components: ' + JSON.stringify(foey)
    );
    let icon = component.get('_registeredItems').map(item=>{ return item.get('icon');});
    let arrangedIcon = new A(component.get('arrangedContent').map(item=>{ return item.get('icon');}));
    assert.ok(
      foey.every(item => { return arrangedFoey.contains(item);} ),
      'Icon properties were equivalent between list\'s arrangedContent and the registered item components: ' + JSON.stringify(icon)
    );
    assert.deepEqual(
      new A(component.get('_registeredItems').map( item => { return item.get('type'); })).uniq(),
      ['ui-item'],
      'all registered items should be of type ui-item.'
    );
    // Test mappings at the Item level
    assert.equal(
      component.get('_registeredItems').findBy('foo','Groceries').get('title'),
      'Groceries',
      'The foo property should have an alias to title in the item component (via a map hash prop on list)'
    );
    assert.equal(
      component.get('_registeredItems').findBy('bar','visit sick uncle Joe').get('subHeading'),
      'visit sick uncle Joe',
      'The bar property should have an alias to subHeading in the item component (via a direct property mapping proxied from list)'
    );
    // DOM checking
    assert.equal(
      component.$('.center-pane .title').length,
      3,
      'The DOM should have 3 items with "titles" in it'
    );
    assert.equal(
      component.$('.right-pane .badge').length,
      2,
      'The DOM should have 2 items with "badges" in it'
    );
    done();
  },100);
});


test('Test that decorator properties make it through to items', function(assert) {
  const component = this.subject();
  const Decorator = Ember.ObjectProxy.extend({
    opinion: computed('foo', function() {
      return this.get('foo') === 'Groceries' ? 'yup' : 'nope';
    })
  });
  // Set
  component.set('items', [
    Ember.Object.create({when: 2, foo: "Groceries", bar: "hungry, hungry, hippo", icon: "shopping-cart", badge: 1}),
    Ember.Object.create({when: 3, foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance", badge: 6}),
    Ember.Object.create({when: 4, foo: "Pub", bar: "it's time for some suds", icon: "beer", walk: true})
  ]);
  // Decorate
  component.set('items', component.get('items').map(item => {
    return Decorator.create({content:item});
  }));
  // Look for decorations
  assert.equal(component.get('items.0.opinion'), 'yup', 'the opinion CP should exist and produce a proper response' );
  assert.equal(component.get('items.1.opinion'), 'nope', 'the opinion CP should exist and produce a proper response' );
  // Now look in the Item component
  let done = assert.async();
  run.later( () => {
    assert.ok(component.get('_registeredItems'), 'List\'s registered items array has been populated');
    // assert.equal(component.get('_registeredItems.length'), 3, 'there should be three registered items.');
    // assert.equal(
    //   component.get('_registeredItems').findBy('foo','Groceries').get('title'),
    //   'Groceries',
    //   'The item component also HAS the the ornamented "opinion" property and it set to the correct value'
    // );
    done();
  },150);
});
