import Ember from 'ember';
import layout from '../templates/components/ui-icon-aspect';
import UiAspect from 'ui-list/components/ui-aspect';

export default UiAspect.extend({
  layout: layout,
  aspectType: 'icon',
  icon: Ember.computed.alias('value')
});

