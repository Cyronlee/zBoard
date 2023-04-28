import { NextApiHandler } from 'next';
import moment, { Moment } from 'moment';
import { getProjectTimelineFakeData } from '../../../fake/project_timeline.fake';
import { delay1s } from '@/lib/delay';
import { projectTimelineConfig } from '../../../config/project_timeline.config';

interface CardTransition {
  column_id: number;
  start: string | Moment;
}

interface TimelineCard {
  startDate: string;
  endDate: string;
  card_id: string;
  title: string;
  color: string;
  column_id: number;
  owner_user_id: number;
  co_owner_ids: number[];
  deadline: string;
  transitions: CardTransition[];
}

interface User {
  name: string;
  avatar: string;
}

interface KanbanUser {
  user_id: number;
  username: string;
  avatar: string;
  realname: string;
  is_confirmed: number;
  is_enabled: number;
}

const handler: NextApiHandler = async (req, res) => {
  const startDate = req.query.start_date as string;
  const endDate = req.query.end_date as string;
  getProjectTimeline(startDate, endDate)
    .then((response) => res.status(200).json(response))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
};

const kanbanConfig = projectTimelineConfig.datasource.kanbanize;

const getProjectTimeline = async (startDate: string, endDate: string) => {
  if (kanbanConfig.enabled) {
    return await fetchCards(startDate, endDate);
  }
  return delay1s(getProjectTimelineFakeData);
};

const fetchCards = async (startDate: string, endDate: string) => {
  const columnIds = kanbanConfig.monitorColumns.map((item) => item.id).join(',');
  const typeIds = kanbanConfig.monitorCardTypes.map((item) => item.id).join(',');
  const fields = searchParams.fields.join(',');
  const expand = searchParams.expand.join(',');
  const cardsAPI = `${kanbanConfig.baseUrl}/api/v2/cards?board_ids=${kanbanConfig.boardId}&column_ids=${columnIds}&type_ids=${typeIds}&fields=${fields}&expand=${expand}&in_current_position_since_from_date=${startDate}`;
  const response = await fetch(cardsAPI, {
    headers: {
      apikey: kanbanConfig.apikey || '',
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const json = await response.json();

  const userIds: number[] = json.data.data.flatMap(
    ({ owner_user_id, co_owner_ids }: { owner_user_id: number; co_owner_ids: number[] }) => [
      owner_user_id,
      ...co_owner_ids,
    ]
  );
  const buildUserInfo = await fetchUserInfo(userIds);

  let cards = json.data.data.map((card: TimelineCard) => buildCardInfo(card, buildUserInfo));
  return cards.filter(
    (card: TimelineCard) => card.startDate >= startDate && card.endDate < endDate
  );
};

const buildCardInfo = (card: TimelineCard, buildUserInfo: (userId: number) => User | null) => {
  const [startDate, endDate] = calculateStartEndDate(card);
  const getColumnName = (columnId: number) => {
    return kanbanConfig.monitorColumns.find((c) => c.id === columnId)?.name;
  };
  return {
    cardNo: card.card_id,
    cardName: card.title,
    startDate: startDate,
    endDate: endDate,
    color: card.color,
    status: getColumnName(card.column_id),
    owner: buildUserInfo(card.owner_user_id),
    coOwners: card.co_owner_ids?.map((id: number) => buildUserInfo(id)),
  };
};

const fetchUserInfo = async (userIds: number[]) => {
  const uniqueUserIds = [...new Set(userIds)].filter((id) => id).join(',');
  const userAPI = `${kanbanConfig.baseUrl}/api/v2/users?user_ids=${uniqueUserIds}&fields=user_id,username,realname,avatar`;
  const response = await fetch(userAPI, {
    headers: {
      apikey: kanbanConfig.apikey || '',
    },
  });
  const json = await response.json();

  return (userId: number) => {
    const user = json.data.find((user: KanbanUser) => user.user_id === userId);
    return user
      ? {
          name: user.realname,
          avatar: user.avatar,
        }
      : null;
  };
};

const calculateStartEndDate = (card: TimelineCard): [startDate: string, endDate: string] => {
  // Find the first time a card was moved to configured columns
  const startTime = card.transitions?.find((transition: CardTransition) =>
    kanbanConfig.startColumns.map(({ id }) => id).includes(transition.column_id)
  )?.start;
  let endTime = card.transitions?.find((transition: CardTransition) =>
    kanbanConfig.endColumns.map(({ id }) => id).includes(transition.column_id)
  )?.start;
  endTime =
    endTime || card.deadline || moment(startTime).add(kanbanConfig.defaultIterationWeeks, 'weeks');

  return [moment(startTime).format('YYYY-MM-DD'), moment(endTime).format('YYYY-MM-DD')];
};

const searchParams = {
  fields: [
    'card_id',
    'title',
    'owner_user_id',
    'type_id',
    'size',
    'priority',
    'color',
    'deadline',
    'is_blocked',
  ],
  expand: ['co_owner_ids', 'transitions'],
};

export default handler;
