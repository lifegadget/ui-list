import Ember from 'ember';
const { computed, observer, $, A, run, on, typeOf, debug } = Ember;     

export default Ember.Mixin.create({

  // NOTE: some browsers -- including Safari -- object to having filter property set
  _propertyRemapping: Ember.on('init', function() {
    Ember.A(this.get('attributeBindings')).removeObject('filter');
  })
});
