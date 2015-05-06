import Ember from 'ember';
const { computed, observer, $, A, run, on } = Ember;    // jshint ignore:line

export default Ember.Controller.extend({

  queryParams: ['mood','size','style'],
  
  items: [
    {foo: "Groceries", bar: "hungry, hungry, hippo", icon: "cutlery", badge: 6},
    {foo: "Hospital", bar: "visit sick uncle Joe", icon: "ambulance"},
    {foo: "Pub", bar: "it's time for some suds", icon: "beer"},
    {foo: "Took Cab", bar: "took a cab, drinking not driving", icon: "cab"},
    {foo: "Had Coffee", bar: "need to chill out after that beer", icon: "coffee"}
  ],
  map: {
    title: 'foo',
    subHeading: 'bar'
  },
  sillyLogic: function(context) {
    let mood = null;
    let things = [
      {type: 'goodThings', value: ['Pub']},
      {type: 'badThings', value: ['Hospital']},
      {type: 'dubiousThings', value: ['Groceries','Had Coffee']}
    ];
    let moodRing = { 
      goodThings: 'success', badThings: 'error', dubiousThings: 'warning' 
    };
    
    things.forEach( thing => {
      if(context.title && Ember.A(thing.value).contains(context.title)) {
        mood = moodRing[thing.type];
      }
    });
      
    return mood;
  },
  moodStrategy: 'static',
  enableStaticChooser: on('init',computed('moodStrategy', function() {
    return this.get('moodStrategy') === 'static';
  })),
  
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
  mood: 'default',
  style: 'default',
  size: 'default',
  defaultIcon: 'envelope',
  
  loadEmberData: on('init', function() {
    let items = A(this.get('items'));
    let index = 1;
    console.log('inserting to ED: %o', items);
    items.forEach( item => {
      this.store.push('activity', {id: index++, foo: item.foo, bar: item.bar, icon: item.icon, badge: item.badge});
    })
  })

});