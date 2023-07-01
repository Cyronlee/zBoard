export const ticketStatusConfig = {
  title: 'Ticket Status',
  refreshIntervalSeconds: 60,
  datasource: {
    zendesk: {
      enabled: false,
      baseUrl: process.env.ZENDESK_BASE_URL,
      userEmail: process.env.ZENDESK_USER_EMAIL,
      // refresh interval for Ticket Status
      apiToken: process.env.ZENDESK_API_TOKEN,
      // Zendesk viewId you want to monitor
      viewId: '30000000',
    },
    jira: {
      enabled: true,
      baseUrl: process.env.JIRA_BASE_URL,
      userEmail: process.env.JIRA_USER_EMAIL,
      apiToken: process.env.JIRA_API_TOKEN,
      boardId: process.env.JIRA_BOARD_ID,
    }
  },
};
