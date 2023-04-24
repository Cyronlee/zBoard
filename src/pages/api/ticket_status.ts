import { NextApiHandler } from 'next';
import _ from 'lodash';
import { zendeskConfig } from '@/../config/zendesk.config';
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

const handler: NextApiHandler = async (req, res) => {
  getAllBuildStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllBuildStatus = async () => {
  if (!zendeskConfig.apiToken) {
    return delay1s(getTicketStatusFakeData);
  }
  return await fetchTickets();
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

export default handler;
