export const ownerRotationConfig = {
  title: 'Owner Rotation',
  // datasource can be ApiTable or GoogleSheet, which means different source of datasheet
  datasource: 'ApiTable',
  // the base url of datasource, which is different between ApiTable and GoogleSheet
  // baseUrl: 'https://docs.google.com/spreadsheets/d/',
  baseUrl: 'https://apitable.com/fusion/v1/datasheets/',
  // refresh interval for Owner Rotation, when it's zero it means close the auto refresh
  refreshIntervalSeconds: 0,
  // key - which represent api token in ApiTable or docId in GoogleSheet.
  // for ApiTable you can see the api token in user profile settings,
  // for GoogleSheet you can find the docId following the baseUrl of GoogleSheet link.
  key: 'uskM0EJKuuJcPQu6waAF0Or',
  // datasheets you want to monitor
  rotations: [
    {
      subject: 'Stand Up',
      color: 'green',
      // for ApiTable it means apiTableId in the url
      // for GoogleSheet it means sheetName below the document
      sheetId: 'sheet-id1',
    },
    {
      subject: 'BAU',
      color: 'blue',
      sheetId: 'sheet-id2',
    },
    {
      subject: 'Retro',
      color: 'purple',
      sheetId: 'sheet-id3',
    },
    {
      subject: 'Showcase',
      color: 'teal',
      sheetId: 'sheet-id4',
    },
  ],
};
