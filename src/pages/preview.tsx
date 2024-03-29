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
import DashboardPreview from '@/components/DashboardPreview';

const FullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Preview: FC = () => {
  return (
    <FullScreenContainer>
      <DashboardPreview />
    </FullScreenContainer>
  );
};

export default Preview;
