import Ember from 'ember';

export default Ember.Controller.extend({

  queryParams: ['designImage'],
  designImage: 'hl-design',

  designImages: [
    {id: 'hl-design', name: 'HL Design'},
    {id: 'responsibilities', name: 'Responsibilities'},
  ]

});
