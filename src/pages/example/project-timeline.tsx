import { VStack, Heading } from '@chakra-ui/react';
import React from 'react';
import ProjectTimeline from '@/components/ProjectTimeline';
import CollapseNavbar from '@/components/CollapseNavbar';

const ProjectTimelinePage = () => {
  return (
    <VStack>
      <CollapseNavbar />
      <ProjectTimeline />
    </VStack>
  );
};

export default ProjectTimelinePage;
