import Ember from 'ember';
import list from '../mixins/list';
import layout from '../templates/components/ui-list';
const { computed } = Ember;

export default Ember.Component.extend(list, {
  layout,
  tagName: '',

});
