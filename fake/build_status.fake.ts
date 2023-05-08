import { faker } from '@faker-js/faker';

const repos = Array.from({ length: 9 }).map(() => {
  return {
    projectName: faker.word.noun(),
    branch: faker.helpers.arrayElement(['master', 'release']),
  };
});

export const getBuildStatusFakeData = () => {
  return repos.map((repo) => {
    return {
      projectName: repo.projectName,
      branch: repo.branch,
      status: faker.helpers.arrayElement([
        'success',
        'failed',
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
