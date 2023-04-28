import { faker } from '@faker-js/faker';
import moment from 'moment';

export const getOwnerRotationFakeData = () => {
  return Array.from(['STAND UP', 'USER SUPPORT', 'RETRO', 'ALERTS']).map((type) => {
    return {
      subject: type,
      color: faker.helpers.arrayElement(['green', 'cyan', 'blue', 'teal', 'purple', 'pink']),
      icon: faker.helpers.arrayElement(['email', 'repeat', 'calendar']),
      members: [
        {
          name: faker.name.fullName(),
          startDate: moment().subtract(14, 'days').format('YYYY-MM-DD'),
          endDate: moment().subtract(8, 'days').format('YYYY-MM-DD'),
        },
        {
          name: faker.name.fullName(),
          startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
        },
        {
          name: faker.name.fullName(),
          startDate: moment().add(8, 'days').format('YYYY-MM-DD'),
          endDate: moment().add(14, 'days').format('YYYY-MM-DD'),
        },
      ],
    };
  });
};
