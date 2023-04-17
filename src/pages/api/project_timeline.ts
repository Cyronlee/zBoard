import { NextApiHandler } from 'next';
import _ from 'lodash';
import moment from 'moment';
import { zendeskConfig } from '@/../config/zendesk.config';
import { getProjectTimelineFakeData } from '../../../fake/project_timeline.fake';
import { delay1s } from '@/lib/delay';
import { btoa } from 'buffer';
import { kanbanConfig, kanbanSearchParam } from '@/../config/kanban.config';

const handler: NextApiHandler = async (req, res) => {
  getProjectTimeline()
    .then((response) => res.status(200).json(response))
    .catch((err) => {
      console.error(err);
      res.status(500).send(err.message);
    });
};

const getProjectTimeline = async () => {
  if (!kanbanConfig.apikey) {
    return delay1s(getProjectTimelineFakeData);
  }
  return await fetchCards();
};

const fetchCards = async () => {
  const columnIds = kanbanSearchParam.columns.map((item) => item.id).join(',');
  const typeIds = kanbanSearchParam.types.map((item) => item.id).join(',');
  const fields = kanbanSearchParam.fields.join(',');
  const expand = kanbanSearchParam.expand.join(',');
  const cardsAPI = `${kanbanConfig.baseUrl}/api/v2/cards?board_ids=${kanbanConfig.boardId}&column_ids=${columnIds}&type_ids=${typeIds}&fields=${fields}&expand=${expand}&in_current_position_since_from_date=2023-03-10`;
  const response = await fetch(cardsAPI, {
    headers: {
      apikey: kanbanConfig.apikey || '',
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const json = await response.json();
  const buildUserInfo = await fetchUserInfo(json);
  return json.data.data.map((card: any) => buildCardInfo(card, buildUserInfo));
};

const buildCardInfo = (card: any, buildUserInfo: any) => {
  const startTime = calculateStartTime(card);
  const getColumnName = (columnId: number) => {
    return kanbanSearchParam.columns.find((c) => c.id === columnId)?.name;
  };
  return {
    cardNo: card.card_id,
    cardName: card.title,
    startDate: moment(startTime).format('YYYY-MM-DD'),
    endDate: moment(calculateEndTime(card, startTime)).format('YYYY-MM-DD'),
    color: card.color,
    status: getColumnName(card.column_id),
    owner: buildUserInfo(card.owner_user_id),
    coOwners: card.co_owner_ids?.map((id: number) => buildUserInfo(id)),
  };
};

const fetchUserInfo = async (rawJson: any) => {
  const duplicateUserIds: number[] = rawJson.data.data.flatMap(
    ({ owner_user_id, co_owner_ids }: any) => [owner_user_id, ...co_owner_ids]
  );
  // eslint-disable-next-line
  const userIds = [...new Set(duplicateUserIds)].filter((id) => id).join(',');
  const userAPI = `${kanbanConfig.baseUrl}/api/v2/users?user_ids=${userIds}&fields=user_id,username,realname,avatar`;
  const response = await fetch(userAPI, {
    headers: {
      apikey: kanbanConfig.apikey || '',
    },
  });
  const json = await response.json();

  return (userId: number) => {
    const user = json.data.find((user: any) => user.user_id === userId);
    return user
      ? {
          name: user.realname,
          avatar: user.avatar,
        }
      : null;
  };
};

const getColumnIds = (...columnNames: string[]) => {
  return kanbanSearchParam.columns
    .filter((c) => columnNames.includes(c.name))
    .map((c) => c.id);
};

const calculateStartTime = (card: any) => {
  return card.transitions.find((transition: any) =>
    getColumnIds('To Do', 'In Progress').includes(transition.column_id)
  )?.start;
};

const calculateEndTime = (card: any, startTime: any) => {
  let endTime = card.transitions.find((transition: any) =>
    getColumnIds('Done(Iteration)').includes(transition.column_id)
  )?.start;
  return endTime || card.deadline || moment(startTime).add(2, 'weeks');
};

export default handler;
