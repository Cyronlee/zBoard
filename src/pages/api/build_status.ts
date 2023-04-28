import { NextApiHandler } from 'next';
import { delay1s } from '@/lib/delay';
import { getBuildStatusFakeData } from '../../../fake/build_status.fake';
import { buildStatusConfig } from '../../../config/build_status.config';
import { getAllCircleBuildStatus } from '@/pages/api/circle_build_status';
import { getAllGitHubStatus } from '@/pages/api/github_build_status';

const handler: NextApiHandler = async (req, res) => {
  getCIStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getCIStatus = async () => {
  if (
    !buildStatusConfig.datasource.github.enabled &&
    !buildStatusConfig.datasource.circleCI.enabled
  ) {
    return delay1s(getBuildStatusFakeData);
  }
  const responses = await Promise.all([getAllCircleBuildStatus(), getAllGitHubStatus()]);
  return responses.flat();
};

export default handler;
