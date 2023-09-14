import React from 'react';
import moment from 'moment';
import {
  Avatar,
  Badge,
  Box,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  CardFooter,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import AcknowledgeBox from './AcknowledgeBox';

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
  waiting: 'yellow',
  pending: 'gray',
  startup_failure: 'red',
};

const BuildStatusCard = ({ buildStatus }: BuildStatusCardProps) => {
  const colorScheme = statusColorScheme[buildStatus.status] || 'red';
  const startTime = moment(buildStatus.stopTime).format('YYYY-MM-DD HH:mm:ss');
  return (
    <Card color='white' bgColor={`${colorScheme}.500`} p='8px' borderWidth='1px' borderRadius='lg'>
      <CardHeader>
        <Flex>
          <Heading size='xl'>{buildStatus.projectName}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <HStack>
          <Badge variant='subtle' colorScheme={colorScheme}>
            {buildStatus.status}
          </Badge>
          <Flex align='center'>
            <TimeIcon w='12px' h='12px' />
            <Text ml='10px'>{startTime}</Text>
          </Flex>
        </HStack>
        <Divider mt='2px' mb='2px' />
        <Flex align='center'>
          <Avatar w='32px' h='32px' name={buildStatus.username} src={buildStatus.avatarUrl} />
          <VStack align='stretch'>
            <Box ml='4px'>
              <Text fontSize='md'>
                {buildStatus.username} on <b>{buildStatus.branch}</b>
              </Text>
              <Text fontSize='md' noOfLines={1}>
                {buildStatus.commitSubject}
              </Text>
            </Box>
          </VStack>
        </Flex>
      </CardBody>
      <CardFooter justify='space-around'>
        {colorScheme === 'red' && <AcknowledgeBox />}
      </CardFooter>
    </Card>
  );
};

export default BuildStatusCard;
