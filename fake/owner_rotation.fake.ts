import { faker } from '@faker-js/faker';

export const getOwnerRotationFakeData = () => {
  return Array.from(['STAND UP', 'USER SUPPORT', 'RETRO']).map((type) => {
    return {
      ownerType: type,
      owners: [
        {
          name: faker.name.fullName(),
          isOwner: 1,
        },
        {
          name: faker.name.fullName(),
          isOwner: 0,
        },
        {
          name: faker.name.fullName(),
          isOwner: 0,
        },
      ],
    };
  });
};
