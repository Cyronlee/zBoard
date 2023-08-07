import moment, { Moment } from 'moment';

import { Ticket } from '@/pages/api/ticket_status';
import { ticketStatusConfig } from '@/../config/ticket_status.config';

export const sendBotNotification = async (tickets: Ticket[], lastSendTime: string | null) => {
  if (lastSendTime == null) {
    lastSendTime = moment().subtract(ticketStatusConfig.refreshIntervalSeconds, 'seconds').format();
  }
  await sendNewReceivedTickets(tickets, moment(lastSendTime));
  await sendNewUpdatedTickets(tickets, moment(lastSendTime));

  console.log(`finish sending after ${lastSendTime}`);
};

const buildCardBody = (noticeType: string, ticket: Ticket) => {
  const ticketLink = `${ticketStatusConfig.datasource.zendesk.baseUrl}/agent/tickets/${ticket.id}`;
  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        // icon_url: 'https://cdn-icons-png.flaticon.com/128/6188/6188613.png',
        desc: noticeType,
        desc_color: 0,
      },
      main_title: {
        title: ticket.subject,
        desc: `from: ${ticket.via.source.from.name}`,
      },
      horizontal_content_list: [
        {
          keyname: 'id',
          value: ticket.id,
          type: 1,
          url: ticketLink,
        },
        {
          keyname: 'assignee',
          value: findAssigneeName(ticket.assignee_id),
        },
      ],
      card_action: {
        type: 1,
        url: ticketLink,
      },
    },
  };
};

const buildTextBody = (content: string, zendeskUserId: number) => {
  let assigneeMobile = findAssigneeMobile(zendeskUserId);
  return {
    msgtype: 'text',
    text: {
      content: content,
      mentioned_mobile_list: [assigneeMobile],
    },
  };
};

const sendToWeCome = async (body: any) => {
  if (!ticketStatusConfig.bot.wecome.enabled) {
    return;
  }

  const response = await fetch(ticketStatusConfig.bot.wecome.webhook || '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log('---start sending---');
  console.log(body);
  console.log(`---end with status ${response.statusText}---`);
};

const findAssigneeMobile = (assigneeId: number) => {
  const assignee = JSON.parse(ticketStatusConfig.bot.wecome.members || '').find(
    (member: any) => member.id === assigneeId
  );
  return assignee ? assignee.mobile : '';
};

const findAssigneeName = (assigneeId: number) => {
  const assignee = JSON.parse(ticketStatusConfig.bot.wecome.members || '').find(
    (member: any) => member.id === assigneeId
  );
  return assignee ? assignee.name : 'Team';
};

const sendNewReceivedTickets = async (tickets: Ticket[], lastSendMoment: moment.Moment) => {
  let ticketsToBeSent = tickets.filter(
    (ticket) => ticket.status === 'new' && moment(ticket.created_at).isSameOrAfter(lastSendMoment)
  );
  for (const ticket of ticketsToBeSent) {
    console.log(`new received ticket ${ticket.id} will be sent`);
    await sendToWeCome(buildCardBody('New ticket received', ticket));
  }
};

const sendNewUpdatedTickets = async (tickets: Ticket[], lastSendMoment: moment.Moment) => {
  let ticketsToBeSent = tickets.filter(
    (ticket) => ticket.status === 'open' && moment(ticket.updated_at).isSameOrAfter(lastSendMoment)
  );
  for (const ticket of ticketsToBeSent) {
    console.log(`new updated ticket ${ticket.id} will be sent`);
    await sendToWeCome(buildCardBody('Ticket updated to open', ticket));
  }
};
