interface RecordItem {
  fields: Object;
}

export const fetchFieldsFromApiTable = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const json = await response.json();
  return json.data?.records?.flatMap((item: RecordItem) => item.fields);
};
