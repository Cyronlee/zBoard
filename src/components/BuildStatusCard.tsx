import React from 'react';
import moment from 'moment';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { BiTime } from 'react-icons/bi';
import { TimeIcon } from '@chakra-ui/icons';

interface BuildStatusCardProps {
  buildStatus: BuildStatus;
}

export interface BuildStatus {
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
  on_hold: string;
  running: string;
  canceled: string;
  unauthorized: string;
}

const statusColorScheme: StatusColorScheme = {
  success: 'green',
  on_hold: 'purple',
  running: 'blue',
  canceled: 'gray',
  unauthorized: 'orange',
};

const BuildStatusCard = ({ buildStatus }: BuildStatusCardProps) => {
  const colorScheme = statusColorScheme[buildStatus.status] || 'gray';
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
