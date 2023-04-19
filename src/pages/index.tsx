import { VStack, HStack, Box } from '@chakra-ui/react';
import BuildStatusOverview from '@/components/BuildStatusOverview';
import TicketStatusOverview from '@/components/TicketStatusOverview';
import ProjectTimeline from '@/components/ProjectTimeline';
import CollapseNav from '@/components/CollapseNav';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <Box w="100vw" h="100vh" p="8px" pt="0">
      <VStack h="100%">
        <CollapseNav></CollapseNav>
        <HStack h="448px" w="100%">
          <BuildStatusOverview flex="75%" h="100%" />
          <TicketStatusOverview flex="25%" h="100%" />
        </HStack>
        <ProjectTimeline flex="1" />
      </VStack>
    </Box>
  );
}
