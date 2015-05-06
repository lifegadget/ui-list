import DS from 'ember-data';
const { attr, hasMany, belongsTo } = DS; // jshint ignore:line

export default DS.Model.extend({
	foo: attr('string'),
	bar: attr('string'),
	icon: attr('string'),
  badge: attr('number')
});
