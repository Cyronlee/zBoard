export const googleSheetConfig = {
  // baseUrl: process.env.GOOGLE_SHEET_BASE_URL,
  baseUrl: 'https://docs.google.com/spreadsheets/d/',
  // refresh interval for Owner Rotation
  refreshIntervalSeconds: 0,
  // datasheets you want to monitor
  // you can find the docId just after baseUrl of the GoogleSheet link.
  docId: 'google-sheet-id',
  rotations: [
    {
      // sheetName is the name of each tab under the GoogleSheet document
      sheetName: 'Stand Up List',
      // sheetAlias is the text to display in the dashboard
      subject: 'STAND UP',
      color: 'green',
    },
    {
      sheetName: 'BAU List',
      subject: 'USER SUPPORT',
      color: 'blue',
    },
    {
      sheetName: 'Retro List',
      subject: 'RETRO',
      color: 'purple',
    },
  ],
};
