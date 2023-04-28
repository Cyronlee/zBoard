import { NextApiHandler } from 'next';
import _ from 'lodash';
import { buildStatusConfig } from '../../../config/build_status.config';

interface PipelineTriggerActor {
  login: string;
  avatar_url: string;
}

interface PipelineTrigger {
  actor: PipelineTriggerActor;
}

interface PipelineVcsCommit {
  body: string;
  subject: string;
}

interface PipelineVcs {
  commit: PipelineVcsCommit;
}

interface Workflow {
  id: string;
  created_at: string;
  status: string;
}

interface Workflows {
  items: Workflow[];
}

interface Pipeline {
  id: string;
  updated_at: string;
  trigger: PipelineTrigger;
  vcs: PipelineVcs;
}

interface Pipelines {
  items: Pipeline[];
}

const circleCIConfig = buildStatusConfig.datasource.circleCI;

const handler: NextApiHandler = async (req, res) => {
  getAllCircleBuildStatus()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(500).send(err.message));
};

export const getAllCircleBuildStatus = async () => {
  if (circleCIConfig.enabled) {
    return await Promise.all(
      circleCIConfig.projects.map((project) => {
        return getBuildStatus(project);
      })
    );
  }
  return [];
};

const getBuildStatus = async ({
  projectName,
  projectSlug,
  branch,
}: {
  projectName: string;
  projectSlug: string;
  branch: string;
}) => {
  const latestPipeline: Pipeline = await getLatestPipeline(projectSlug, branch);
  const { login, avatar_url } = latestPipeline.trigger.actor;
  const latestWorkflow: Workflow = await getLatestWorkflow(latestPipeline.id);
  return {
    projectName: projectName,
    branch,
    username: login,
    avatarUrl: avatar_url,
    commitSubject: latestPipeline.vcs.commit?.subject || 'git tag',
    status: latestWorkflow.status,
    stopTime: latestWorkflow.created_at,
  };
};

const getLatestPipeline = async (projectSlug: string, branch: string): Promise<Pipeline> => {
  let pipelines: Pipelines = await fetchPipelines(projectSlug, branch);
  return _.orderBy(pipelines.items, 'updated_at', 'desc')[0];
};

const getLatestWorkflow = async (pipelineId: string): Promise<Workflow> => {
  const workflows = await fetchWorkflows(pipelineId);
  return _.orderBy(workflows.items, 'created_at', 'desc')[0];
};

const fetchPipelines = async (projectSlug: string, branch: string): Promise<Pipelines> => {
  const url = `https://circleci.com/api/v2/project/${projectSlug}/pipeline?branch=${branch}&circle-token=${circleCIConfig.apiToken}`;
  const response = await fetch(url);
  let json: Pipelines = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
};

const fetchWorkflows = async (pipelineId: string): Promise<Workflows> => {
  const url = `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow?circle-token=${circleCIConfig.apiToken}`;
  const response = await fetch(url);
  let json: Workflows = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(json));
  }
  return json;
};

export default handler;
