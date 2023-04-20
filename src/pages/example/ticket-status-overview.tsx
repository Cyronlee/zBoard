import { VStack, Heading } from '@chakra-ui/react';
import React from 'react';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import CollapseNavbar from '@/components/CollapseNavbar';

const TicketStatusOverviewPage = () => {
  return (
    <VStack>
      <CollapseNavbar />
      <TicketStatusOverview />
    </VStack>
  );
};

export default TicketStatusOverviewPage;
