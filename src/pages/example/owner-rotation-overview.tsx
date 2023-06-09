import { VStack } from '@chakra-ui/react';
import React from 'react';
import CollapseNavbar from '@/components/CollapseNavbar';
import OwnerRotationOverview from '@/components/OwnerRotationOverview';

const OwnerRotationOverviewPage = () => {
  return (
    <VStack>
      <CollapseNavbar />
      <OwnerRotationOverview w="300px" />
    </VStack>
  );
};

export default OwnerRotationOverviewPage;
