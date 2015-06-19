import Ember from 'ember';  // jshint ignore:line
import layout from '../templates/components/ui-item';
import UiList from '../components/ui-item';
import SortableItem from '../mixins/sortable-item';

export default UiList.extend(SortableItem,{
  layout: layout,
  iconRight: null,
  tagName: 'li',
  handleRight: 'bars',
  handle: '.ui-aspect-handle',
  _aspects: ['title','subHeading','icon','image','badge','handle'],
});
