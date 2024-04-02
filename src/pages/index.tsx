import { Flex, Box, VStack } from '@chakra-ui/react';
import CollapseNavbar from '@/components/CollapseNavbar';
import UpdateChecker from '@/components/UpdateChecker';
import DashboardPreview from '@/components/DashboardPreview';

export default function Home() {
  return (
    <Flex flexDirection="column" w="100vw" h="100vh">
      <UpdateChecker />
      <CollapseNavbar />
      <Box flex="1" width="100vw" overflow="hidden">
        <DashboardPreview />
      </Box>

      {/* fixed layout */}
      {/*<VStack px="8px" flex="1" width="100vw" overflow="hidden">*/}
      {/*  <HStack w="100%" h="100%">*/}
      {/*    <OwnerRotationOverview width="240px" />*/}
      {/*    <VStack flex="1" h="100%" overflow="hidden">*/}
      {/*      <HStack h="448px" w="100%">*/}
      {/*        <BuildStatusOverview flex="75%" h="100%" />*/}
      {/*        <TicketStatusOverview flex="25%" h="100%" />*/}
      {/*      </HStack>*/}
      {/*      <ProjectTimeline flex="1" />*/}
      {/*    </VStack>*/}
      {/*  </HStack>*/}
      {/*</VStack>*/}
    </Flex>
  );
}
