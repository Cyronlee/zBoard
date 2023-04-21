import { NextApiHandler } from 'next';
import { delay1s } from '@/lib/delay';
import { googleSheetConfig } from '../../../config/google_sheet.config';
import { RotationOwner, RotationOwners } from '@/components/OwnerRotationList';
import { getOwnerRotationFakeData } from '../../../fake/owner_rotation.fake';

interface SheetCol {
  id: string;
  label: string;
  type: string;
}

interface SheetRowItem {
  v: string | number;
  f?: string;
}

interface SheetRow {
  c: SheetRowItem[];
}

const handler: NextApiHandler = async (req, res) => {
  getAllOwners()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllOwners = async () => {
  if (!googleSheetConfig.baseUrl) {
    return delay1s(getOwnerRotationFakeData);
  }
  return await fetchOwners();
};

const fetchOwners = async () => {
  let allOwners: RotationOwners[] = [];
  const datasheets = googleSheetConfig.documents[0].sheets;
  for (const sheet of datasheets) {
    const docUrl = `${googleSheetConfig.baseUrl}${googleSheetConfig.documents[0].docId}/gviz/tq?`;
    const query = encodeURIComponent('Select *');
    const sheetUrl = `${docUrl}&sheet=${sheet.sheetName}&tq=${query}`;
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error('failed to fetch rotation owners');
    }
    const json = await response.text();
    const res = JSON.parse(json.substring(47).slice(0, -2));
    const fields = res.table.cols.flatMap((it: SheetCol) => it.label);
    const values = res.table.rows.map((it: SheetRow) => it.c);

    let owners: RotationOwner[] = [];
    values.forEach((row: SheetRowItem[]) => {
      let dataRow: RotationOwner = { cname: '', ename: '', is_owner: 0 };
      fields.forEach((col: string, index: number) => {
        dataRow[col] = row[index].v;
      });
      owners.push(dataRow);
    });
    let allOwner = {
      ownerType: sheet.sheetAlias,
      owners: owners,
    };
    allOwners.push(allOwner);
  }
  return allOwners;
};

export default handler;
