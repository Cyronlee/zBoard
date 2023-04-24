import { NextApiHandler } from 'next';
import { delay1s } from '@/lib/delay';
import { googleSheetConfig } from '../../../config/google_sheet.config';
import { RotationOwner, RotationOwners } from '@/components/OwnerRotationOverview';
import { getOwnerRotationFakeData } from '../../../fake/owner_rotation.fake';
import moment from 'moment';

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

interface RowOwner {
  name: string;
  start_time: string;
  end_time: string;
  [key: string]: any;
}

const handler: NextApiHandler = async (req, res) => {
  getAllOwners()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllOwners = async () => {
  if (googleSheetConfig.documents[0]?.docId?.length < 20) {
    return delay1s(getOwnerRotationFakeData);
  }
  return await fetchOwners();
};

const formatSheetRow = (list: SheetRowItem[]) => {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i] === null || list[i].v === null) {
      list.splice(i, 1);
    }
  }
};

const datePattern = /^Date\(\d{4},\d{1,2},\d{1,2}\)$/;

const dateStrConverter = (dateStr: string) => {
  if (datePattern.test(dateStr)) {
    const dates = dateStr.substring(5).slice(0, -1).split(',');
    return new Date(Number(dates[0]), Number(dates[1]), Number(dates[2]));
  }
  return null;
};

const dateConverter = (date: Date | null) => {
  return `Date(${date?.getFullYear()},${date?.getMonth()},${date?.getDate()})`;
};

const isAfter = (dateStr1: string, dateStr2: string) => {
  let moment1 = moment(dateStrConverter(dateStr1));
  let moment2 = moment(dateStrConverter(dateStr2));
  return moment1.isAfter(moment2);
};

const isTodayBetween = (startDate: string, endDate: string) => {
  let current = moment();
  let moment1 = moment(dateStrConverter(startDate));
  if (startDate && !endDate) {
    return moment1.isAfter(current);
  }
  let moment2 = moment(dateStrConverter(endDate));
  if (!startDate && endDate) {
    return moment2.isBefore(current);
  }
  return current.isBetween(moment1, moment2);
};

const modifyDateByDay = (originDate: Date | null, offset: number) => {
  originDate?.setDate(originDate?.getDate() + offset);
  return dateConverter(originDate);
};

const fillEmptyOwner = (rows: RowOwner[]) => {
  if (rows.length > 0) {
    let current = moment();
    let date1 = dateStrConverter(rows[0].start_time);
    let moment1 = moment(date1);
    if (current.isBefore(moment1)) {
      rows.unshift({ name: 'Nobody', start_time: '', end_time: modifyDateByDay(date1, -1) });
      return;
    }
    let date2 = dateStrConverter(rows[rows.length - 1].end_time);
    let moment2 = moment(date2);
    if (current.isAfter(moment2)) {
      rows.push({ name: 'Nobody', start_time: modifyDateByDay(date2, 1), end_time: '' });
    }
  }
};

const convertRowOwners = (rows: RowOwner[]) => {
  let owners: RotationOwner[] = [];
  if (rows?.every((it) => datePattern.test(it.start_time))) {
    rows.sort((a, b) => (isAfter(a.start_time, b.start_time) ? 1 : -1));
    rows.sort((a, b) => {
      if (!datePattern.test(b.end_time)) {
        b.end_time = modifyDateByDay(dateStrConverter(a.start_time), -1);
      }
      return 1;
    });
  }
  fillEmptyOwner(rows);
  rows.forEach((row) => {
    owners.push({
      name: row.name,
      isOwner: isTodayBetween(row.start_time, row.end_time),
    });
  });
  return owners;
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
    let fields = res.table.cols.flatMap((it: SheetCol) => it.label);
    fields = fields.filter((it: string) => it !== '');
    let values = res.table.rows.map((it: SheetRow) => it.c);
    values.forEach((it: SheetRowItem[]) => formatSheetRow(it));
    let ownerRows: RowOwner[] = [];
    values.forEach((row: SheetRowItem[]) => {
      let dataRow: RowOwner = {
        name: '',
        start_time: '',
        end_time: '',
      };
      fields.forEach((col: string, index: number) => {
        dataRow[col] = row[index]?.v ?? '';
      });
      ownerRows.push(dataRow);
    });
    let allOwner = {
      ownerType: sheet.sheetAlias,
      owners: convertRowOwners(ownerRows),
    };
    allOwners.push(allOwner);
  }
  return allOwners;
};

export default handler;
