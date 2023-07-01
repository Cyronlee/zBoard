import { faker } from '@faker-js/faker';
import { ticketStatusConfig } from "../config/ticket_status.config";

export const getTicketStatusFakeData = () => {
  return Array.from({ length: 20 }).map(() => {
    return {
      subject: faker.lorem.sentence(25),
      status: faker.helpers.arrayElement(ticketStatusConfig.mockJiraEnabled ?
          ['BLOCKED', 'Done', 'Backlog', 'In dev', 'In QA'] : ['new', 'open', 'pending']),
      url: faker.internet.url(),
      created_at: faker.date.recent(1).toISOString(),
      updated_at: faker.date.recent(1).toISOString(),
    };
  });
};
