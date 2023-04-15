export const circleCIConfig = {
  // generate token here: https://app.circleci.com/settings/user/tokens
  apiToken: process.env.CIRCLE_CI_API_TOKEN,
  projects: [
    {
      projectName: 'project_name',
      projectSlug: 'gh/org_name/repo_name',
      branch: 'master',
    },
    {
      projectName: 'project_name',
      projectSlug: 'gh/org_name/repo_name',
      branch: 'master',
    },
  ],
};
