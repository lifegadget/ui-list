import Ember from 'ember';
const { keys, create } = Object; // jshint ignore:line
const {computed, observer, $, A, run, on, typeOf, debug, defineProperty, get, set, inject, isEmpty} = Ember;  // jshint ignore:line


export default Ember.Controller.extend({

  queryParams: ['mood','size','style','compressed'],
  tabs: [
    {title: 'Inline', subHeading:'using inline component syntax'},
    {title: 'Block', subHeading:'using block component syntax'}
  ],

  items: [
    Ember.Object.create({when: 2, foo: 'Groceries', bar: 'hungry, hungry, hippo', icon: 'shopping-cart', badge: 1}),
    Ember.Object.create({when: 3, foo: 'Hospital', bar: 'visit sick uncle Joe', icon: 'ambulance', badge: 6}),
    Ember.Object.create({when: 4, foo: 'Pub', bar: 'it\'s time for some suds', icon: 'beer'}),
    Ember.Object.create({when: 5, foo: 'Took Cab', bar: 'took a cab, drinking not driving', icon: 'cab'}),
    Ember.Object.create({when: 6, foo: 'Had Coffee', bar: 'need to chill out after that beer', icon: 'coffee'}),
    Ember.Object.create({when: 1, foo: 'Ate Breakfast', bar: 'start of every good morning', icon: 'cutlery'})
  ],
  emberItems: [
    {foo: 'Groceries', bar: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
    {foo: 'Hospital', bar: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
    {foo: 'Pub', bar: 'it\'s time for some suds', icon: 'beer'},
    {foo: 'Took Cab', bar: 'took a cab, drinking not driving', icon: 'cab'},
    {foo: 'Had Coffee', bar: 'need to chill out after that beer', icon: 'coffee'}
  ],
  map: {
    title: 'foo',
    subHeading: 'bar'
  },
  sillyLogic: function(item) {
    let badge = item.get('badge');
    let moodiness = badge && badge > 5 ? 'error' : 'warning';
    return badge ? moodiness : null;
  },
  sortOrders: [
    {name: 'Natural', id: null},
    {name: 'When', id: 'when'},
    {name: 'Badges', id: 'badge'},
    {name: 'Title', id: 'title'}
  ],
  sortAscending: true,
  mood: 'default',
  moodStrategy: 'static',
  moodFunction: computed('moodStrategy', function() {
    return this.get('moodStrategy') === 'static' ? false : true;
  }),
  listFilter: computed('isFiltered', function() {
    const FilterFunc = item => { return item.badge > 0; };
    return this.get('isFiltered') ? FilterFunc : null;
  }),
  toggledBadge: on('init',computed('showBadge', function() {
    return this.get('showBadge') ? 4 : null;
  })),
  showBadge: true,
  showIcon: true,
  showSubHeading: true,
  toggledIcon: on('init',computed('showIcon', function() {
    return this.get('showIcon') ? 'envelope' : null;
  })),
  toggledSubHeading: on('init',computed('showSubHeading', function() {
    return this.get('showSubHeading') ? 'ran 12mi in London' : null;
  })),
  style: 'default',
  size: 'default',
  compressed: false,
  defaultIcon: 'envelope',
  actions: {
    onClick(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      flashMessages.success(`onClick Event. Click originated from ${o.granularity}; item was ${o.itemTitle}`);
      console.log('click: %o', o);
    },
    onHover(o) {
      const flashMessages = Ember.get(this, 'flashMessages');
      if(o.eventTrigger === 'mouse-enter') {
        flashMessages.info(`onHover Event. Mouse entered ${o.granularity.toUpperCase()} component.`);
      } else {
        flashMessages.warning(`onHover Event. Mouse left ${o.granularity.toUpperCase()} component.`);
      }
      console.log('container hover: %o', o);
    }
  }

});
