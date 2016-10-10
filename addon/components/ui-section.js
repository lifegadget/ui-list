import Ember from 'ember';
import layout from '../templates/components/ui-section';
const classyProps = ['fit', 'valign', 'halign'];

export default Ember.Component.extend({
  layout,
  tagName: '',

  classy: Ember.computed(...classyProps, function() {
    const { fit, valign, halign } = this.getProperties(...classyProps);
    return `ui-list${fit ? ' fit': ''}`;
  }),

});
