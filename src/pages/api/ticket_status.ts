import { NextApiHandler } from 'next';
import { ticketStatusConfig } from '../../../config/ticket_status.config';
import { getTicketStatusFakeData } from '../../../fake/ticket_status.fake';
import { delay1s } from '@/lib/delay';
import { btoa } from 'buffer';
import { sendBotNotification } from '@/lib/weComeBot';

export interface Ticket {
  id: number;
  subject: string;
  via: {
    source: {
      from: {
        address: string;
        name: string;
      };
      to: {
        name: string;
        address: string;
      };
    };
  };
  priority: string;
  status: string;
  url: string;
  created_at: string;
  updated_at: string;
  assignee_id: number;
}

const zendeskConfig = ticketStatusConfig.datasource.zendesk;

const handler: NextApiHandler = async (req, res) => {
  getAllBuildStatus(req.query['lastFetchTime'])
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllBuildStatus = async (lastFetchTime: any) => {
  if (zendeskConfig.enabled) {
    return await fetchTickets(lastFetchTime);
  }
  return delay1s(getTicketStatusFakeData);
};

const fetchTickets = async (lastFetchTime: any) => {
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

  await sendBotNotification(allTickets, lastFetchTime);

  return allTickets;
};

export default handler;
