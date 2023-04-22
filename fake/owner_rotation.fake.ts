import { faker } from '@faker-js/faker';

export const getOwnerRotationFakeData = () => {
  return Array.from(['STAND UP', 'USER SUPPORT', 'RETRO']).map((type) => {
    return {
      ownerType: type,
      owners: [
        {
          ename: faker.name.fullName(),
          is_owner: 1,
        },
        {
          ename: faker.name.fullName(),
          is_owner: 0,
        },
        {
          ename: faker.name.fullName(),
          is_owner: 0,
        },
      ],
    };
  });
};
