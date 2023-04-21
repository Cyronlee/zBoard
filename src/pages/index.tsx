import { VStack, HStack, Box } from '@chakra-ui/react';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import ProjectTimeline from '@/components/ProjectTimeline';
import CollapseNavbar from '@/components/CollapseNavbar';
import UpdateChecker from '@/components/UpdateChecker';
import OwnerRotationList from '@/components/OwnerRotationList';

export default function Home() {
  return (
    <Box w="100vw" h="100vh" p="8px" pt="0">
      <UpdateChecker />
      <VStack h="100%">
        <CollapseNavbar />
        <HStack h="100%" w="100%">
          <OwnerRotationList w="15%" />
          <VStack h="100%" w="85%">
            <HStack h="448px" w="100%">
              <BuildStatusOverview flex="75%" h="100%" />
              <TicketStatusOverview flex="25%" h="100%" />
            </HStack>
            <ProjectTimeline flex="1" />
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
