import { VStack, Heading } from '@chakra-ui/react';
import React from 'react';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import CollapseNavbar from '@/components/CollapseNavbar';

const BuildStatusOverviewPage = () => {
  return (
    <VStack>
      <CollapseNavbar />
      <BuildStatusOverview />
    </VStack>
  );
};

export default BuildStatusOverviewPage;
