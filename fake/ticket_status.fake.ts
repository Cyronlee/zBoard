import { faker } from '@faker-js/faker';

export const getTicketStatusFakeData = () => {
  return Array.from({ length: 20 }).map(() => {
    return {
      subject: faker.lorem.sentence(25),
      status: faker.helpers.arrayElement(['new', 'open', 'pending']),
      url: faker.internet.url(),
      created_at: faker.date.recent(1).toISOString(),
      updated_at: faker.date.recent(1).toISOString(),
    };
  });
};
