export const ticketStatusConfig = {
  title: 'Ticket Status',
  refreshIntervalSeconds: 120,
  datasource: {
    zendesk: {
      enabled: true,
      baseUrl: process.env.ZENDESK_BASE_URL,
      userEmail: process.env.ZENDESK_USER_EMAIL,
      // refresh interval for Ticket Status
      apiToken: process.env.ZENDESK_API_TOKEN,
      // Zendesk viewId you want to monitor
      viewId: '36345004',
    },
  },
  bot: {
    wecome: {
      enabled: true,
      webhook: process.env.ZENDESK_BOT_WEBHOOK,
      members: process.env.ZENDESK_BOT_MEMBERS,
    },
  },
};
