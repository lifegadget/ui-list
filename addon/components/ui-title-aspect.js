import Ember from 'ember';
import UiAspect from 'ui-list/components/ui-aspect';

export default UiAspect.extend({
  aspectType: 'title',
  title: Ember.computed.alias('value')
});
