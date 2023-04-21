export const ownerRotationConfig = {
  title: 'Owner Rotation',
  // refresh interval for Owner Rotation, when it's zero it means close the auto refresh
  refreshIntervalSeconds: 60 * 60,
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
    // use APITable, example datasheet: https://apitable.com/share/shrvpzFE4CmCF59ygUbaW
    apiTable: {
      enabled: false,
      // for ApiTable you can see the api token in user profile settings,
      apiKey: process.env.API_TABLE_API_KEY,
      baseUrl: 'https://apitable.com/fusion/v1/datasheets/',
      rotations: [
        {
          subject: 'Stand Up',
          color: 'blue',
          icon: 'calendar',
          datasheetId: 'dstrMjKsApEaKHKnE2',
        },
        {
          subject: 'BAU',
          color: 'purple',
          icon: 'calendar',
          datasheetId: 'dstrTnan1lJftJAvwH',
        },
        {
          subject: 'Retro',
          color: 'pink',
          icon: 'repeat',
          datasheetId: 'dstVZBx1XWJxcA5jKM',
        },
        {
          subject: 'Showcase',
          color: 'green',
          icon: 'calendar',
          datasheetId: 'dstkQEESC5j0eFSBSR',
        },
      ],
    },
    // use Google Sheet, example sheet https://docs.google.com/spreadsheets/d/15txMkkkWBgxS7PCpInC3NBg9kaEi-ZhHjdALNRV-5G8/edit?usp=sharing
    googleSheet: {
      enabled: true,
      baseUrl: 'https://docs.google.com/spreadsheets/d/',
      // for GoogleSheet you can find the docId following the baseUrl of GoogleSheet link.
      docId: process.env.GOOGLE_SHEET_ID,
      rotations: [
        {
          subject: 'Stand Up',
          color: 'blue',
          icon: 'calendar',
          sheetName: 'standup',
        },
        {
          subject: 'BAU',
          color: 'purple',
          icon: 'calendar',
          sheetName: 'bau',
        },
        {
          subject: 'Retro',
          color: 'pink',
          icon: 'repeat',
          sheetName: 'retro',
        },
        {
          subject: 'Showcase',
          color: 'green',
          icon: 'calendar',
          sheetName: 'showcase',
        },
      ],
    },
  },
};
