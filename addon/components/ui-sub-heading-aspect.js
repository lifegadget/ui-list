import Ember from 'ember';
import UiAspect from 'ui-list/components/ui-aspect';

export default UiAspect.extend({
  aspectType: 'sub-heading',
  subHeading: Ember.computed.alias('value')
});
