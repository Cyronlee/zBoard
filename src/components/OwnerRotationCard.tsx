import React, { ReactNode } from 'react';
import { Box, Card, CardBody, Heading, HStack, Text } from '@chakra-ui/react';
import { Member } from '@/components/OwnerRotationOverview';
import moment from 'moment';

interface OwnerRotationProps {
  subject: string;
  members: Member[];
  colorScheme: string;
  icon: ReactNode;
}

const OwnerRotationCard = ({ subject, members, colorScheme, icon }: OwnerRotationProps) => {
  const currentMoment = moment();
  members.sort((a, b) => moment(a.startDate).valueOf() - moment(b.startDate).valueOf());
  let ownerIndex = members.findIndex(
    (member) =>
      moment(member.startDate).isSameOrBefore(currentMoment) &&
      currentMoment.isSameOrBefore(member.endDate)
  );
  const preOwner = members[ownerIndex - 1] || 'None';
  const owner = members[ownerIndex] || 'None';
  const nextOwner = members[ownerIndex + 1] || 'None';

  return (
    <Card
      direction="row"
      w="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      variant="outline"
    >
      <Box w="10px" bg={colorScheme}></Box>
      <CardBody display="flex" flexDirection="column" p="16px" pl="12px">
        <Heading size="md" fontWeight="light">
          <HStack>
            {icon}
            <Text whiteSpace="nowrap">{subject}</Text>
          </HStack>
        </Heading>
        <Text color={colorScheme} whiteSpace="nowrap">
          {owner.startDate.slice(5)} - {owner.endDate.slice(5)}
        </Text>
        <Box mt="8px">
          <Text fontSize="16px" color="gray" whiteSpace="nowrap" overflow="hidden">
            {preOwner.name}
          </Text>
          <Text
            fontSize="22px"
            fontWeight="bold"
            px="4px"
            my="2px"
            color="white"
            bg={colorScheme}
            noOfLines={1}
          >
            {owner.name}
          </Text>
          <Text fontSize="16px" color="gray" whiteSpace="nowrap" overflow="hidden">
            {nextOwner.name}
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};

export default OwnerRotationCard;
