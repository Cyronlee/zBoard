interface RecordItem {
  fields: Object;
}

export const parseApiTable = async (url: string, token: string, msg = '') => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(msg);
  }
  const json = await response.json();
  return json.data?.records?.flatMap((item: RecordItem) => item.fields);
};
