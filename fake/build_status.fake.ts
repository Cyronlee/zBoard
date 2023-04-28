import { faker } from '@faker-js/faker';

export const getBuildStatusFakeData = () => {
  return Array.from({ length: 9 }).map(() => {
    return {
      projectName: faker.word.noun(),
      branch: 'master',
      status: faker.helpers.arrayElement([
        'success',
        'on_hold',
        'running',
        'canceled',
        'unauthorized',
      ]),
      stopTime: faker.date.recent(1).toISOString(),
      username: faker.name.fullName(),
      avatarUrl: faker.image.avatar(),
      commitSubject: faker.git.commitMessage(),
    };
  });
};
