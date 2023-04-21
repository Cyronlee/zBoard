export const googleSheetConfig = {
  // baseUrl: 'https://docs.google.com/spreadsheets/d/',
  baseUrl: process.env.GOOGLE_SHEET_BASE_URL,
  // refresh interval for Owner Rotation
  refreshIntervalSeconds: 3600,
  // datasheets you want to monitor
  documents: [
    {
      docId: 'google-sheet-id',
      sheets: [
        {
          sheetName: 'JIGSAW STAND UP',
          sheetAlias: 'STAND UP',
        },
        {
          sheetName: 'JIGSAW BAU',
          sheetAlias: 'USER SUPPORT',
        },
        {
          sheetName: 'JIGSAW RETRO',
          sheetAlias: 'RETRO',
        },
      ],
    },
  ],
};
