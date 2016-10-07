import Ember from 'ember';
import list from '../mixins/list';
import layout from '../templates/components/ui-list';

export default Ember.Component.extend(list, {
  layout,
  tagName: '',

});
