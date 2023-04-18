export const zendeskConfig = {
  baseUrl: process.env.ZENDESK_BASE_URL,
  userEmail: process.env.ZENDESK_USER_EMAIL,
  apiToken: process.env.ZENDESK_API_TOKEN,
  // refresh interval for Ticket Status
  refreshIntervalSeconds: 60,
  // Zendesk viewId you want to monitor
  viewId: '30000000',
};
