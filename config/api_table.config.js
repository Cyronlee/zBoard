export const apiTableConfig = {
  // baseUrl: process.env.API_TABLE_BASE_URL,
  baseUrl: 'https://apitable.com/fusion/v1/datasheets/',
  // refresh interval for Owner Rotation
  refreshIntervalSeconds: 0,
  apiToken: 'your-api-token',
  // datasheets you want to monitor
  rotations: [
    {
      subject: 'STAND UP',
      color: 'green',
      apiTableId: 'api-table-id1',
    },
    {
      subject: 'USER SUPPORT',
      color: 'blue',
      apiTableId: 'api-table-id2',
    },
    {
      subject: 'RETRO',
      color: 'purple',
      apiTableId: 'api-table-id3',
    },
  ],
};
