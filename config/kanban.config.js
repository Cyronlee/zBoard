export const kanbanConfig = {
  baseUrl: process.env.KANBANIZE_BASE_URL,
  apikey: process.env.KANBANIZE_API_KEY,
  boardId: 193,
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
  startColumns: [
    { id: 3942, name: 'To Do' },
    { id: 3942, name: 'To Do' },
  ],
  endColumns: [{ id: 3944, name: 'Done(Iteration)' }],
  monitorCardTypes: [
    { id: 3955, name: 'Business' },
    { id: 3956, name: 'Technical' },
    { id: 3957, name: 'Defect' },
    { id: 10133, name: 'Spike' },
  ],
  defaultIterationWeeks: 2,
};
