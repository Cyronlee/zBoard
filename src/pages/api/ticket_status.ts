import { NextApiHandler } from 'next';
import { ticketStatusConfig } from '../../../config/ticket_status.config';
import { getTicketStatusFakeData } from '../../../fake/ticket_status.fake';
import { delay1s } from '@/lib/delay';
import { btoa } from 'buffer';

interface Ticket {
  subject: string;
  status: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const zendeskConfig = ticketStatusConfig.datasource.zendesk;
const jiraConfig = ticketStatusConfig.datasource.jira;

const handler: NextApiHandler = async (req, res) => {
  getAllBuildStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllBuildStatus = async () => {
  if (zendeskConfig.enabled) {
    return await fetchTickets();
  }
  if (jiraConfig.enabled) {
    return await fetchJiraIssues();
  }
  return delay1s(getTicketStatusFakeData);
};

const fetchTickets = async () => {
  const emailAddress = zendeskConfig.userEmail;
  const apiToken = zendeskConfig.apiToken;
  const basicToken = btoa(`${emailAddress}/token:${apiToken}`);
  let nextPageUrl = `${zendeskConfig.baseUrl}/api/v2/views/${zendeskConfig.viewId}/tickets?sort_by=updated_at&sort_order=desc`;
  let allTickets: Ticket[] = [];
  while (nextPageUrl) {
    const response = await fetch(nextPageUrl, {
      headers: {
        Authorization: `Basic ${basicToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('failed to fetch zendesk tickets');
    }
    const json = await response.json();
    nextPageUrl = json.next_page;
    allTickets = allTickets.concat(json.tickets);
  }
  return allTickets;
};

const fetchJiraIssues = async () => {
  const emailAddress = jiraConfig.userEmail;
  const apiToken = jiraConfig.apiToken;
  const basicToken = btoa(`${emailAddress}:${apiToken}`);
  const activeSprintUrl = `${jiraConfig.baseUrl}/rest/agile/1.0/board/${jiraConfig.boardId}/sprint?state=active`
  const response = await fetch(activeSprintUrl, {
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  })
  if (!response.ok) {
    throw new Error('failed to fetch jira active sprint');
  }

  const activeSprintJson = await response.json();
  const activeSprintId = activeSprintJson.values[0].id;
  const allIssuesUrl = `${jiraConfig.baseUrl}/rest/greenhopper/latest/rapid/charts/sprintreport?rapidViewId=${jiraConfig.boardId}&sprintId=${activeSprintId}`;

  const issuesResponse = await fetch(allIssuesUrl, {
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });
  if (!issuesResponse.ok) {
    throw new Error('failed to fetch jira issues in active sprint: ' + activeSprintId);
  }
  const issuesJson = await issuesResponse.json();
  let allJiraIssues: Ticket[] = [];
  const completedIssues = issuesJson.contents.issuesNotCompletedInCurrentSprint;
  // you can do some custom order for showing jira issues according to status of your jira issues
  // @ts-ignore
  issuesJson.contents.completedIssues.concat(completedIssues).map((issue) => {
    const jiraIssue = {
      subject: issue.summary,
      status: issue.statusName,
      url: issue.url,
      created_at: issue.updatedAt,
      updated_at: issue.updatedAt,
    };
    allJiraIssues.push(jiraIssue);
  })

  return allJiraIssues;
};

export default handler;
