import { NextApiHandler } from 'next';
import { ownerRotationConfig } from '../../../config/owner_rotation.config';
import { Member, Rotation } from '@/components/OwnerRotationOverview';
import { delay1s } from '@/lib/delay';
import { fetchFieldsFromApiTable } from '@/lib/apiTableFetcher';
import { fetchFieldsFromGoogleSheet } from '@/lib/googleSheetFetcher';
import { getOwnerRotationFakeData } from '../../../fake/owner_rotation.fake';
import moment from 'moment';

const handler: NextApiHandler = async (req, res) => {
  getAllOwners()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllOwners = async () => {
  if (ownerRotationConfig.datasource.localData.enabled) {
    return ownerRotationConfig.datasource.localData.rotations;
  }
  if (ownerRotationConfig.datasource.apiTable.enabled) {
    return await loadDataFromApiTable();
  }
  if (ownerRotationConfig.datasource.googleSheet.enabled) {
    return await loadDataFromGoogleSheet();
  }
  return delay1s(getOwnerRotationFakeData);
};

const loadDataFromApiTable = async () => {
  const apiTableConfig = ownerRotationConfig.datasource.apiTable;
  return await Promise.all(
    apiTableConfig.rotations.map(async (rotation) => {
      const tableViewUrl = `${apiTableConfig.baseUrl}${rotation.datasheetId}/records`;
      let members = await fetchFieldsFromApiTable(tableViewUrl, apiTableConfig.apiKey as string);
      return {
        subject: rotation.subject,
        color: rotation.color,
        icon: rotation.icon,
        members: sortMembers(members),
      };
    })
  );
};

const loadDataFromGoogleSheet = async () => {
  const googleSheetConfig = ownerRotationConfig.datasource.googleSheet;
  return await Promise.all(
    googleSheetConfig.rotations.map(async (rotation) => {
      const docUrl = `${googleSheetConfig.baseUrl}${googleSheetConfig.docId}/gviz/tq?`;
      let members = await fetchFieldsFromGoogleSheet(docUrl, rotation.sheetName);
      return {
        subject: rotation.subject,
        color: rotation.color,
        icon: rotation.icon,
        members: sortMembers(members),
      };
    })
  );
};

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateFormat = 'YYYY-MM-DD';

const isAfter = (date1: string, date2: string) =>
  moment(date1, dateFormat).isAfter(moment(date2, dateFormat));

const sortMembers = (rows: { [key: string]: any }[]) => {
  let members: Member[] = [];
  if (rows?.every((it) => datePattern.test(it.startDate))) {
    rows.sort((a, b) => (isAfter(a.startDate, b.startDate) ? 1 : -1));
    members = rows.map((row) => ({
      name: row.name,
      startDate: row.startDate,
      endDate: row.endDate,
    }));
  }
  return members;
};

export default handler;
