import { faker } from '@faker-js/faker';

export const getProjectTimelineFakeData = () => {
  return Array.from({ length: 10 }).map(() => {
    const startDate = faker.date.between(faker.date.recent(30), faker.date.soon(30));
    const endDate = faker.date.soon(30, startDate);
    return {
      cardNo: faker.random.numeric(6),
      cardName: faker.lorem.sentence(20),
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      color: faker.helpers.arrayElement(['4681c8', 'cf7035', '795fce']),
      owner: {
        name: faker.name.fullName(),
        avatar: faker.image.avatar(),
      },
      coOwners: [
        {
          name: faker.name.fullName(),
          avatar: faker.image.avatar(),
        },
      ],
    };
  });
};
