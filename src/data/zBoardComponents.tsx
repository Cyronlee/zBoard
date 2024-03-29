import { ComponentProps } from 'react';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectTimelinePreview from '@/components/ProjectTimeline.preview.png';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import TicketStatusOverviewPreview from '@/components/TicketStatusOverview.preview.png';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import BuildStatusOverviewPreview from '@/components/BuildStatusOverview.preview.png';
import OwnerRotationOverview from '@/components/OwnerRotationOverview';
import OwnerRotationOverviewPreview from '@/components/OwnerRotationOverview.preview.png';

export const zBoardComponents = [
  {
    name: 'ProjectTimeline',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <ProjectTimeline h="100%" {...props} />
    ),
    preview: ProjectTimelinePreview,
    layout: {
      w: 8,
      minW: 2,
      h: 7,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'TicketStatusOverview',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <TicketStatusOverview h="100%" maxWidth="auto" {...props} />
    ),
    preview: TicketStatusOverviewPreview,
    layout: {
      w: 4,
      minW: 2,
      h: 6,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'BuildStatusOverview',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <BuildStatusOverview h="100%" maxWidth="auto" {...props} />
    ),
    preview: BuildStatusOverviewPreview,
    layout: {
      w: 9,
      minW: 2,
      h: 6,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'OwnerRotationOverview',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <OwnerRotationOverview h="100%" maxWidth="auto" {...props} />
    ),
    preview: OwnerRotationOverviewPreview,
    layout: {
      w: 2,
      minW: 2,
      h: 6,
      minH: 4,
    },
  },
];
