export const circleCIConfig = {
  // generate token here: https://app.circleci.com/settings/user/tokens
  apiToken: process.env.CIRCLE_CI_API_TOKEN,
  // refresh interval for Build Status
  refreshIntervalSeconds: 60,
  // projects you want to monitor
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
