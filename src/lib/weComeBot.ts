import moment from 'moment';

import { Ticket } from '@/pages/api/ticket_status';
import { ticketStatusConfig } from '@/../config/ticket_status.config';

export const sendBotNotification = (tickets: Ticket[], startMoment: moment.Moment) => {
  sendNewReceivedTickets(tickets, startMoment.clone());
  sendNewUpdatedTickets(tickets, startMoment.clone());
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

const sendNewReceivedTickets = (tickets: Ticket[], startMoment: moment.Moment) => {
  tickets.forEach((ticket) => {
    if (ticket.status !== 'new') {
      return;
    }
    if (
      moment(ticket.created_at).isBefore(
        startMoment.clone().subtract(ticketStatusConfig.refreshIntervalSeconds, 'seconds')
      )
    ) {
      console.log(
        `new received will not send ${ticket.id} cus ${moment(
          ticket.updated_at
        ).format()} isBefore ${startMoment
          .clone()
          .subtract(ticketStatusConfig.refreshIntervalSeconds, 'seconds')
          .format()}`
      );
      return;
    }

    sendToWeCome(buildCardBody('New ticket received', ticket));
  });
};

const sendNewUpdatedTickets = (tickets: Ticket[], startMoment: moment.Moment) => {
  tickets.forEach((ticket) => {
    if (ticket.status !== 'open') {
      return;
    }
    if (
      moment(ticket.updated_at).isBefore(
        startMoment.clone().subtract(ticketStatusConfig.refreshIntervalSeconds, 'seconds')
      )
    ) {
      console.log(
        `new updated will not send ${ticket.id} cus ${moment(
          ticket.updated_at
        ).format()} isBefore ${startMoment
          .clone()
          .subtract(ticketStatusConfig.refreshIntervalSeconds, 'seconds')
          .format()}`
      );
      return;
    }

    sendToWeCome(buildCardBody('Ticket updated to open', ticket));
  });
};
