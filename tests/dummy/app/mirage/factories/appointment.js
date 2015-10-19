import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  firstName: faker.name.firstName,       // using faker
  lastName: faker.name.lastName,
  email: function(i) {                  // and functions
    return 'person' + i + '@email.com';
  },
  when: faker.date.future,
  quantity: faker.random.number,
  avatar: faker.image.avatar,
  topic: faker.lorem.words,
  status: faker.list.random('downloaded','verifying','verified','scheduling','scheduled','preparing','executing','executed')
});
