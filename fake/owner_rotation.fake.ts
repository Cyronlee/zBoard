import { faker } from '@faker-js/faker';

export const getOwnerRotationFakeData = () => {
  return Array.from(['STAND UP', 'USER SUPPORT', 'RETRO']).map((type) => {
    return {
      ownerType: type,
      owners: [
        {
          cname: '',
          ename: faker.name.fullName(),
          is_owner: 1,
        },
        {
          cname: '',
          ename: faker.name.fullName(),
          is_owner: 0,
        },
        {
          cname: '',
          ename: faker.name.fullName(),
          is_owner: 0,
        },
      ],
    };
  });
};
