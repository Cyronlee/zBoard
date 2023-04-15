import { NextApiHandler } from 'next';
import _ from 'lodash';
import { circleCIConfig } from '@/../config/circle_ci.config';
import { getBuildStatusFakeData } from '@/../../fake/build_status.fake';
import { delay1s } from '@/lib/delay';

const handler: NextApiHandler = async (req, res) => {
  getAllBuildStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

const getAllBuildStatus = async () => {
  if (!circleCIConfig.apiToken) {
    return delay1s(getBuildStatusFakeData);
  }
  return await Promise.all(
    circleCIConfig.projects.map((project) => {
      return getBuildStatus(project);
    })
  );
};

const getBuildStatus = async ({ projectName, projectSlug, branch }) => {
  const latestPipeline: any = await getLatestPipeline(projectSlug, branch);
  const { login, avatar_url } = latestPipeline.trigger.actor;
  const latestWorkflow: any = await getLatestWorkflow(latestPipeline.id);
  return {
    projectName: projectName,
    username: login,
    avatarUrl: avatar_url,
    commitSubject: latestPipeline.vcs.commit?.subject || 'git tag',
    status: latestWorkflow.status,
    stopTime: latestWorkflow.created_at,
  };
};

const getLatestPipeline = async (projectSlug: string, branch: string) => {
  let pipelines = await fetchPipelines(projectSlug, branch);
  return _.orderBy(<any>pipelines.items, 'updated_at', 'desc')[0];
};

const getLatestWorkflow = async (pipelineId: string) => {
  const workflows = await fetchWorkflows(pipelineId);
  return _.orderBy(<any>workflows.items, 'created_at', 'desc')[0];
};

const fetchPipelines = async (projectSlug: string, branch: string) => {
  const url = `https://circleci.com/api/v2/project/${projectSlug}/pipeline?branch=${branch}&circle-token=${circleCIConfig.apiToken}`;
  const response = await fetch(url);
  let json = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
};

const fetchWorkflows = async (pipelineId: string) => {
  const url = `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow?circle-token=${circleCIConfig.apiToken}`;
  const response = await fetch(url);
  let json = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
};

export default handler;
