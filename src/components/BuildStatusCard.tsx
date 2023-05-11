import React from 'react';
import moment from 'moment';
import { Avatar, Badge, Box, Divider, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';

interface BuildStatusCardProps {
  buildStatus: BuildStatus;
}

export interface BuildStatus {
  // TODO render style & color by platform: CircleCI or Github
  projectName: string;
  branch: string;
  status: string;
  stopTime: string;
  username: string;
  avatarUrl: string;
  commitSubject: string;
}

interface StatusColorScheme {
  [key: string]: string;
  success: string;
  failed: string;
  on_hold: string;
  running: string;
  canceled: string;
  unauthorized: string;
}

const statusColorScheme: StatusColorScheme = {
  success: 'green',
  failed: 'red',
  on_hold: 'purple',
  running: 'blue',
  canceled: 'gray',
  unauthorized: 'orange',
  completed: 'green',
  action_required: 'purple',
  cancelled: 'gray',
  failure: 'red',
  neutral: 'pink',
  skipped: 'gray',
  stale: 'gray',
  timed_out: 'red',
  in_progress: 'blue',
  queued: 'gray',
  requested: 'gray',
  waiting: 'purple',
  pending: 'gray',
};

const BuildStatusCard = ({ buildStatus }: BuildStatusCardProps) => {
  const colorScheme = statusColorScheme[buildStatus.status] || 'red';
  const startTime = moment(buildStatus.stopTime).format('YYYY-MM-DD HH:mm:ss');
  return (
    <Box
      width="324px"
      //h="108px"
      color="white"
      bgColor={`${colorScheme}.500`}
      p="8px"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Flex>
        <Heading size="md">{buildStatus.projectName}</Heading>
      </Flex>

      <HStack mt="2px">
        <Badge variant="subtle" colorScheme={colorScheme}>
          {buildStatus.status}
        </Badge>
        <Flex align="center">
          <TimeIcon w="12px" h="12px" />
          <Text ml="4px">{startTime}</Text>
        </Flex>
      </HStack>
      <Divider mt="2px" mb="2px" />
      <Flex align="center">
        <Avatar w="32px" h="32px" name={buildStatus.username} src={buildStatus.avatarUrl} />
        <VStack align="stretch">
          <Box ml="4px">
            <Text fontSize="sm">
              {buildStatus.username} on <b>{buildStatus.branch}</b>
            </Text>
            <Text fontSize="sm" noOfLines={1}>
              {buildStatus.commitSubject}
            </Text>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default BuildStatusCard;
