import { NextApiHandler } from 'next';
import { ownerRotationConfig } from '../../../config/owner_rotation.config';
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
  if (ownerRotationConfig.datasource == 'ApiTable' && ownerRotationConfig.key?.length > 20) {
    return await fetchOwnersFromApiTable();
  }
  if (ownerRotationConfig.datasource == 'GoogleSheet' && ownerRotationConfig.key?.length > 20) {
    return await fetchOwnersFromGoogleSheet();
  }
  return delay1s(getOwnerRotationFakeData);
};

const fetchOwnersFromApiTable = async () => {
  let allOwners: Rotation[] = [];
  const datasheets = ownerRotationConfig.rotations;
  for (const sheet of datasheets) {
    let dataSheetUrl = `${ownerRotationConfig.baseUrl}${sheet.sheetId}/records`;
    let members = await parseApiTable(
      dataSheetUrl,
      ownerRotationConfig.key,
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
  const datasheets = ownerRotationConfig.rotations;
  for (const sheet of datasheets) {
    const docUrl = `${ownerRotationConfig.baseUrl}${ownerRotationConfig.key}/gviz/tq?`;
    let memberRows = await parseGoogleSheet(
      docUrl,
      sheet.sheetId,
      'failed to fetch rotation owners'
    );
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
