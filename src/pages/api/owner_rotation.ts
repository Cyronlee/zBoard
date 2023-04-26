import { NextApiHandler } from 'next';
import { googleSheetConfig } from '../../../config/google_sheet.config';
import { apiTableConfig } from '../../../config/api_table.config';
import { Member, Rotation } from '@/components/OwnerRotationOverview';
import { delay1s } from '@/lib/delay';
import { parseApiTable } from '@/lib/parseApiTable';
import { getOwnerRotationFakeData } from '../../../fake/owner_rotation.fake';
import { parseGoogleSheet } from '@/lib/parseGoogleSheet';
import moment from 'moment';

const handler: NextApiHandler = async (req, res) => {
  getAllOwners()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllOwners = async () => {
  // if (googleSheetConfig.docId?.length < 20) {
  if (apiTableConfig.apiToken?.length < 20) {
    return delay1s(getOwnerRotationFakeData);
  }
  return await fetchOwnersFromApiTable();
  // return await fetchOwnersFromGoogleSheet();
};

const fetchOwnersFromApiTable = async () => {
  let allOwners: Rotation[] = [];
  const datasheets = apiTableConfig.rotations;
  for (const sheet of datasheets) {
    let dataSheetUrl = `${apiTableConfig.baseUrl}${sheet.apiTableId}/records`;
    let members = await parseApiTable(
      dataSheetUrl,
      apiTableConfig.apiToken,
      'failed to fetch rotation owners'
    );
    let owner = {
      subject: sheet.subject,
      colorScheme: sheet.color,
      members: sortMembers(members),
    };
    allOwners.push(owner);
  }
  return allOwners;
};

const fetchOwnersFromGoogleSheet = async () => {
  let allOwners: Rotation[] = [];
  const datasheets = googleSheetConfig.rotations;
  for (const sheet of datasheets) {
    const docUrl = `${googleSheetConfig.baseUrl}${googleSheetConfig.docId}/gviz/tq?`;
    let memberRows = await parseGoogleSheet(docUrl, sheet.sheetName, '');
    let allOwner = {
      subject: sheet.subject,
      colorScheme: sheet.color,
      members: sortMembers(memberRows),
    };
    allOwners.push(allOwner);
  }
  return allOwners;
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
