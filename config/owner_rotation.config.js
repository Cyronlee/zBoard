export const ownerRotationConfig = {
  title: 'Owner Rotation',
  // refresh interval for Owner Rotation, when it's zero it means close the auto refresh
  refreshIntervalSeconds: 3600_000,
  // datasource could be localData or ApiTable or GoogleSheet
  datasource: {
    // use local static data, could be masked in process.env.YOUR_KEY
    localData: {
      enabled: false,
      rotations: [
        {
          subject: 'Stand Up',
          color: 'green',
          icon: 'email',
          members: [
            {
              name: 'Tom',
              startDate: '2023-01-01',
              endDate: '2024-01-01',
            },
            {
              name: 'Jerry',
              startDate: '2024-01-01',
              endDate: '2025-01-01',
            },
          ],
        },
      ],
    },
    // use API Table, register here https://apitable.com/
    apiTable: {
      enabled: false,
      // for ApiTable you can see the api token in user profile settings,
      apiKey: process.env.API_TABLE_API_KEY,
      baseUrl: 'https://apitable.com/fusion/v1/datasheets/',
      rotations: [
        {
          subject: 'Stand Up',
          color: 'green',
          icon: 'calendar',
          datasheetId: 'datasheet-id1',
        },
        {
          subject: 'Showcase',
          color: 'blue',
          icon: 'repeat',
          datasheetId: 'datasheet-id2',
        },
      ],
    },
    // use Google Sheet, the doc must be public
    googleSheet: {
      enabled: false,
      baseUrl: 'https://docs.google.com/spreadsheets/d/',
      // for GoogleSheet you can find the docId following the baseUrl of GoogleSheet link.
      docId: '15txMkkkWBgxS7PCpInC3NBg9kaEi-ZhHjdALNRV-5G8',
      rotations: [
        {
          subject: 'Stand Up',
          color: 'green',
          icon: 'calendar',
          sheetName: 'sheet-name1',
        },
        {
          subject: 'Showcase',
          color: 'blue',
          icon: 'repeat',
          sheetName: 'sheet-name2',
        },
      ],
    },
  },
};
