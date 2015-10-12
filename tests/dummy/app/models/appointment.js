import DS from 'ember-data';
const { attr, hasMany, belongsTo } = DS; // jshint ignore:line

export default DS.Model.extend({
	when: attr('string'),
	firstName: attr('string'),
	lastName: attr('string'),
  topic: attr('string'),
  avatar: attr('string'),
  quantity: attr('number')
});
