export const projectTimelineConfig = {
  title: 'Project timeline',
  datasource: {
    kanbanize: {
      enabled: true,
      baseUrl: process.env.KANBANIZE_BASE_URL,
      apikey: process.env.KANBANIZE_API_KEY,
      // boardId could be found in URL like: xxx.kanbanize.com/ctrl_board/<boardId>
      boardId: 193,
      // columnId & columnName could be found in the response when you click a card
      // response like: {..."columnid":"requested_<columnId>","columnname":"<columnName>"...}
      // columns you want to monitor
      monitorColumns: [
        { id: 3942, name: 'To Do' },
        { id: 3943, name: 'In Progress' },
        { id: 3950, name: 'Code Review' },
        { id: 3951, name: 'Ready for QA' },
        { id: 3952, name: 'In QA' },
        { id: 3952, name: 'QA Done' },
        { id: 12630, name: 'Approver Confirmed' },
        { id: 3944, name: 'Done(Iteration)' },
        { id: 4170, name: 'Done(Year to Date)' },
      ],
      // card types you want to monitor
      monitorCardTypes: [
        { id: 10176, name: 'Business' },
        { id: 10181, name: 'Technical' },
        { id: 10174, name: 'Defect' },
        { id: 10133, name: 'Spike' },
      ],
      // a card's startDate will be the first date it was moved to startColumns
      startColumns: [
        { id: 3942, name: 'To Do' },
        { id: 3943, name: 'In Progress' },
      ],
      // a card's endDate will be the first date it was moved to endColumns, otherwise will be the deadline
      endColumns: [{ id: 3944, name: 'Done(Iteration)' }],
      // if no endDate & deadline, endDate will be startDate + n*weeks, define n here
      defaultIterationWeeks: 2,
    },
  },
};
