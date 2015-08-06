import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';
import SortableList from '../mixins/sortable-list';

export default UiList.extend(SortableList,{
  layout: layout,
  type: 'UiSortableItem',
  tagName: 'ul',
  sort: null, // this must remain null to enable the natural order
});
