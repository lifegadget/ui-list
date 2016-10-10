import Ember from 'ember';
import layout from '../templates/components/auto-id';
const { get, computed } = Ember;

export default Ember.Component.extend({
  layout,
  tagName: '',

  item: null,
  size: 10,
  autoId: computed('id', function() {
    return get(this, 'item.id') ? get(this, 'item.id') : Math.random().toString(36).substr(2, get(this, 'size'));
  })
});
