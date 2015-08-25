/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage, {faker}  from 'ember-cli-mirage';
const simpleData = [
  {foo: 'Groceries', bar: 'hungry, hungry, hippo', icon: 'cutlery', badge: 6},
  {foo: 'Hospital', bar: 'visit sick uncle Joe', icon: 'ambulance', badge: 1},
  {foo: 'Pub', bar: 'it\'s time for some suds', icon: 'beer'},
  {foo: 'Took Cab', bar: 'took a cab, drinking not driving', icon: 'cab'},
  {foo: 'Had Coffee', bar: 'need to chill out after that beer', icon: 'coffee'},
  {foo: 'Visit Bob', bar: 'Bob\'s your uncle', icon: 'male'}
];

export default Mirage.Factory.extend({
  foo: faker.list.cycle(simpleData.map(item=>{return item.foo;})),
  bar: faker.list.cycle(simpleData.map(item=>{return item.bar;})),
  icon: faker.list.cycle(simpleData.map(item=>{return item.icon;})),
  badge: faker.list.cycle(simpleData.map(item=>{return item.badge;}))
  // name: 'Pete',                         // strings
  // age: 20,                              // numbers
  // tall: true,                           // booleans

  // email: function(i) {                  // and functions
  //   return 'person' + i + '@test.com';
  // },

  // firstName: faker.name.firstName,       // using faker
  // lastName: faker.name.firstName,
  // zipCode: faker.address.zipCode
});
