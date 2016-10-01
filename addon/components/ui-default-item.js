import Ember from 'ember';
import layout from '../templates/components/ui-default-item';
import item from '../mixins/item';

export default Ember.Component.extend(item, {
  layout,
  tagName: '',


});
