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

interface RowObject {
  [key: string]: any;
}

const formatSheetRow = (list: SheetRowItem[]) => {
  for (let i = list.length - 1; i >= 0; i--) {
    if (list[i] === null || list[i].v === null) {
      list.splice(i, 1);
    }
  }
};

export const parseGoogleSheet = async (docUrl: string, sheetName: string, msg = '') => {
  const query = encodeURIComponent('Select *');
  const sheetUrl = `${docUrl}&sheet=${sheetName}&tq=${query}`;
  const response = await fetch(sheetUrl);
  if (!response.ok) {
    throw new Error(msg);
  }
  const json = await response.text();
  const res = JSON.parse(json.substring(47).slice(0, -2));
  let fields = res.table.cols.flatMap((it: SheetCol) => it.label);
  fields = fields.filter((it: string) => it !== '');
  let values = res.table.rows.map((it: SheetRow) => it.c);
  values.forEach((it: SheetRowItem[]) => formatSheetRow(it));
  let rows: RowObject[] = [];
  values.forEach((row: SheetRowItem[]) => {
    let dataRow: RowObject = {};
    fields.forEach((col: string, index: number) => {
      dataRow[col] = row[index]?.f ?? row[index]?.v ?? '';
    });
    rows.push(dataRow);
  });
  return rows;
};
