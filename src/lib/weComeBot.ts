import moment from 'moment';
import { kv } from '@vercel/kv';

import { Ticket } from '@/pages/api/ticket_status';
import { ticketStatusConfig } from '@/../config/ticket_status.config';

export const sendBotNotification = async (tickets: Ticket[]) => {
  let lastSendTime: string | null = await kv.get<string>('last_send_time');

  let thisMoment = moment();
  if (lastSendTime != null) {
    console.log(`start sending after ${lastSendTime}`);
    await sendNewReceivedTickets(tickets, moment(lastSendTime));
    await sendNewUpdatedTickets(tickets, moment(lastSendTime));
  }

  await kv.set('last_send_time', thisMoment.format());
};

const buildCardBody = (noticeType: string, ticket: Ticket) => {
  const ticketLink = `${ticketStatusConfig.datasource.zendesk.baseUrl}/agent/tickets/${ticket.id}`;
  return {
    msgtype: 'template_card',
    template_card: {
      card_type: 'text_notice',
      source: {
        icon_url: 'https://cdn-icons-png.flaticon.com/128/6188/6188613.png',
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

const sendNewReceivedTickets = (tickets: Ticket[], lastSendMoment: moment.Moment) => {
  tickets.forEach((ticket) => {
    if (ticket.status !== 'new') {
      return;
    }
    if (moment(ticket.created_at).isBefore(lastSendMoment)) {
      console.log(
        `new received will not send ${ticket.id} cus ${moment(
          ticket.updated_at
        ).format()} isBefore ${lastSendMoment.format()}`
      );
      return;
    }

    sendToWeCome(buildCardBody('New ticket received', ticket));
  });
};

const sendNewUpdatedTickets = (tickets: Ticket[], lastSendMoment: moment.Moment) => {
  tickets.forEach((ticket) => {
    if (ticket.status !== 'open') {
      return;
    }
    if (moment(ticket.updated_at).isBefore(lastSendMoment)) {
      console.log(
        `new updated will not send ${ticket.id} cus ${moment(
          ticket.updated_at
        ).format()} isBefore ${lastSendMoment.format()}`
      );
      return;
    }

    sendToWeCome(buildCardBody('Ticket updated to open', ticket));
  });
};
