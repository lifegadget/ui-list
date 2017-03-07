import Ember from 'ember';   
import layout from '../templates/components/ui-list';
import UiList from '../components/ui-list';
import SortableList from '../mixins/sortable-list';

export default UiList.extend(SortableList,{
  layout: layout,
  type: 'ui-sortable-item',
  tagName: 'ul',
  sort: null, // this must remain null to enable the natural order
});
