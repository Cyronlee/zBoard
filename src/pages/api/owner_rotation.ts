import { NextApiHandler } from 'next';
import { delay1s } from '@/lib/delay';
import { vikaConfig } from '../../../config/vika.config';
import { RotationOwners } from '@/components/OwnerRotationList';

const handler: NextApiHandler = async (req, res) => {
  getAllOwners()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllOwners = async () => {
  function getPromise() {
    return new Promise<any>((resolve, _) => resolve([]));
  }

  if (!vikaConfig.apiToken) {
    return delay1s(await getPromise());
  }
  return await fetchOwners();
};

const fetchOwners = async () => {
  let allOwners: RotationOwners[] = [];
  const datasheets = vikaConfig.datasheets;
  for (const sheet of datasheets) {
    let dataSheetUrl = `${vikaConfig.baseUrl}/fusion/v1/datasheets/${sheet.sheetId}/records`;
    const response = await fetch(dataSheetUrl, {
      headers: {
        Authorization: `Bearer ${vikaConfig.apiToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('failed to fetch rotation owners');
    }
    const json = await response.json();
    let owner = {
      ownerType: sheet.ownerType,
      owners: json.data?.records?.flatMap((item: any) => item.fields),
    };
    allOwners.push(owner);
  }
  return allOwners;
};

export default handler;
