import { FC, ComponentProps, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { GridLayout } from '@/components/GridLayout';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectTimelinePreview from '@/components/ProjectTimeline.preview.png';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import TicketStatusOverviewPreview from '@/components/TicketStatusOverview.preview.png';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import BuildStatusOverviewPreview from '@/components/BuildStatusOverview.preview.png';
import OwnerRotationOverview from '@/components/OwnerRotationOverview';
import OwnerRotationOverviewPreview from '@/components/OwnerRotationOverview.preview.png';
import { usePageConfigStore } from '@/stores/pageConfig';

const COMPONENTS = [
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

const Container = styled.div`
  width: 100vw;
  height: 100%;
`;

const DashboardPreview: FC = () => {
  const {
    pageConfig: { rows, cols, rowGap, columnGap, layouts, padding },
  } = usePageConfigStore();

  useEffect(() => {
    usePageConfigStore.persist.rehydrate();
  }, []);

  return (
    // <Container>
    <GridLayout
      rows={rows}
      cols={cols}
      rowGap={rowGap}
      columnGap={columnGap}
      padding={padding}
      layouts={layouts}
      itemRender={({ component }) => {
        const { Component } = COMPONENTS.find(({ name }) => name === component)!;
        return <Component w="100%" h="100%" />;
      }}
    />
    // </Container>
  );
};

export default DashboardPreview;
