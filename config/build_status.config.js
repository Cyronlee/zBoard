export const buildStatusConfig = {
  title: 'Build Status',
  refreshIntervalSeconds: 60,
  datasource: {
    circleCI: {
      enabled: false,
      // generate token here: https://app.circleci.com/settings/user/tokens
      apiToken: process.env.CIRCLE_CI_API_TOKEN,
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
    },
    github: {
      enabled: false,
      // generate GitHub token with Read access to actions, code, and metadata
      apiToken: process.env.GITHUB_API_TOKEN,
      // GitHub API url (for self-hosted GitHub, default URL is https://api.github.com)
      baseUrl: process.env.GITHUB_BASE_URL || 'https://api.github.com',
      // refresh interval for Build Status
      refreshIntervalSeconds: 60,
      // projects you want to monitor
      // workflow ID may check by https://api.github.com/repos/USER/REPO/actions/workflows
      projects: [
        {
          owner: 'microsoft',
          repo: 'vscode',
          branch: 'master',
          workflowId: 123,
        },
      ],
    },
  },
};
