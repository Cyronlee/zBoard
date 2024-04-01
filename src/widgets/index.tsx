import { ComponentProps } from 'react';
import ProjectTimeline from './ProjectTimelineWidget';
import ProjectTimelineImg from '@/widgets/ProjectTimelineWidget/preview.png';
import ZendeskStatusWidget from './ZendeskStatusWidget';
import ZendeskStatusWidgetImg from '@/widgets/ZendeskStatusWidget/preview.png';
import BuildStatusWidget from './BuildStatusWidget';
import BuildStatusWidgetImg from '@/widgets/BuildStatusWidget/preview.png';
import OwnerRotationWidget from './OwnerRotationWidget';
import OwnerRotationWidgetImg from '@/widgets/OwnerRotationWidget/preview.png';

export const zBoardWidgets = [
  {
    name: 'ProjectTimeline',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <ProjectTimeline h="100%" {...props} />
    ),
    preview: ProjectTimelineImg,
    layout: {
      w: 8,
      minW: 2,
      h: 7,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'TicketStatus',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <ZendeskStatusWidget h="100%" maxWidth="auto" {...props} />
    ),
    preview: ZendeskStatusWidgetImg,
    layout: {
      w: 4,
      minW: 2,
      h: 6,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'BuildStatus',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <BuildStatusWidget h="100%" maxWidth="auto" {...props} />
    ),
    preview: BuildStatusWidgetImg,
    layout: {
      w: 9,
      minW: 2,
      h: 6,
      minH: 2,
      maxH: 9,
    },
  },
  {
    name: 'OwnerRotation',
    Component: (props: ComponentProps<typeof ProjectTimeline>) => (
      <OwnerRotationWidget h="100%" maxWidth="auto" {...props} />
    ),
    preview: OwnerRotationWidgetImg,
    layout: {
      w: 2,
      minW: 2,
      h: 6,
      minH: 4,
    },
  },
];
