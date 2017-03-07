import DS from 'ember-data';
const { attr, hasMany, belongsTo } = DS;  

export default DS.Model.extend({
	name: attr('string'),
	type: attr('string'),
	icon: attr('string')
});
