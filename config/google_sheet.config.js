export const googleSheetConfig = {
  // baseUrl: process.env.GOOGLE_SHEET_BASE_URL,
  baseUrl: 'https://docs.google.com/spreadsheets/d/',
  // refresh interval for Owner Rotation
  refreshIntervalSeconds: 3600,
  // datasheets you want to monitor
  documents: [
    {
      // you can find the docId just after baseUrl of the GoogleSheet link.
      docId: 'google-sheet-id',
      sheets: [
        {
          // sheetName is the name of each tab under the GoogleSheet document
          sheetName: 'Stand Up List',
          // sheetAlias is the text to display in the dashboard
          sheetAlias: 'STAND UP',
        },
        {
          sheetName: 'BAU List',
          sheetAlias: 'USER SUPPORT',
        },
        {
          sheetName: 'Retro List',
          sheetAlias: 'RETRO',
        },
      ],
    },
  ],
};
