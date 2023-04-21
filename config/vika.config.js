export const vikaConfig = {
  // baseUrl: 'https://api.vika.cn'
  baseUrl: process.env.VIKA_BASE_URL,
  // get token refer to here: https://developers.vika.cn/api/quick-start
  apiToken: process.env.VIKA_API_TOKEN,
  // refresh interval for Owner Rotation
  refreshIntervalSeconds: 3600,
  // datasheets you want to monitor
  datasheets: [
    {
      sheetId: 'sheet_id',
      sheetName: 'sheet_name',
      ownerType: 'STAND UP',
    },
    {
      sheetId: 'sheet_id',
      sheetName: 'sheet_name',
      ownerType: 'USER SUPPORT',
    },
    {
      sheetId: 'sheet_id',
      sheetName: 'sheet_name',
      ownerType: 'RETRO',
    },
  ],
};
