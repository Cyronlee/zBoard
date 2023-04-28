export const ownerRotationConfig = {
  title: 'Owner Rotation',
  // refresh interval for Owner Rotation, when it's zero it means close the auto refresh
  refreshIntervalSeconds: 0,
  // datasource can be localData or ApiTable or GoogleSheet, which means different source of datasheet
  datasource: {
    // use local static data, could be masked in process.env.YOUR_KEY
    localData: {
      enabled: false,
      rotations: [
        {
          subject: 'Stand Up',
          color: 'green',
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
      apiKey: process.env.APITABLE_API_KEY,
      baseUrl: 'https://apitable.com/fusion/v1/datasheets/',
      rotations: [
        {
          subject: 'Stand Up',
          color: 'green',
          viewId: 'view-id1',
        },
        {
          subject: 'Showcase',
          color: 'blue',
          viewId: 'view-id2',
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
          sheetName: 'sheet-name1',
        },
        {
          subject: 'Showcase',
          color: 'blue',
          sheetName: 'sheet-name2',
        },
      ],
    },
  },
};
