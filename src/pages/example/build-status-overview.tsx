import { Center, Heading } from '@chakra-ui/react';
import React from 'react';
import BuildStatusOverview from '@/components/BuildStatusOverview';

const BuildStatusOverviewPage = () => {
  return (
    <Center>
      <BuildStatusOverview></BuildStatusOverview>
    </Center>
  );
};

export default BuildStatusOverviewPage;
