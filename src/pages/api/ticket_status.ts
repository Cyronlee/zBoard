import { NextApiHandler } from 'next';
import { ticketStatusConfig } from '../../../config/ticket_status.config';
import { getTicketStatusFakeData } from '../../../fake/ticket_status.fake';
import { delay1s } from '@/lib/delay';
import { btoa } from 'buffer';
import { get } from '@/lib/httpClient';

interface Ticket {
  subject: string;
  status: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const zendeskConfig = ticketStatusConfig.datasource.zendesk;

const handler: NextApiHandler = async (req, res) => {
  getAllBuildStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllBuildStatus = async () => {
  if (zendeskConfig.enabled) {
    return await fetchTickets();
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
    const response = await get(nextPageUrl, {
      headers: {
        Authorization: `Basic ${basicToken}`,
      },
    });
    if (response.status !== 200) {
      throw new Error('failed to fetch zendesk tickets');
    }
    const json = response.data;
    nextPageUrl = json.next_page;
    allTickets = allTickets.concat(json.tickets);
  }
  return allTickets;
};

export default handler;
