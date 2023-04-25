import { VStack, HStack } from '@chakra-ui/react';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import ProjectTimeline from '@/components/ProjectTimeline';
import CollapseNavbar from '@/components/CollapseNavbar';
import UpdateChecker from '@/components/UpdateChecker';

export default function Home() {
  return (
    <VStack w="100vw" h="100vh" p="8px" pt="0">
      <UpdateChecker />
      <CollapseNavbar />
      <VStack px="8px" flex="1" width="100vw" overflow="hidden">
        <HStack h="448px" w="100%">
          <BuildStatusOverview flex="75%" h="100%" />
          <TicketStatusOverview flex="25%" h="100%" />
        </HStack>
        <ProjectTimeline flex="1" />
      </VStack>
    </VStack>
  );
}
