import { Badge, Box, Flex, Text, Link } from '@chakra-ui/react';
import moment from 'moment';
import _ from 'lodash';
import React from 'react';

interface TicketListProps {
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  subject: string;
  status: string;
  url: string;
  created_at: string;
  updated_at: string;
}

const TicketList = ({ tickets }: TicketListProps) => {
  const renderTicketInfo = (ticket) => {
    let colorScheme;
    if (ticket.status === 'new') colorScheme = 'yellow';
    else if (ticket.status === 'open') colorScheme = 'red';
    else if (ticket.status === 'hold') colorScheme = 'gray';
    else colorScheme = 'blue';

    return (
      <Box width="sm" p="4px">
        <Flex justifyContent="space-between">
          <Flex>
            <Badge fontSize="sm" mr="4px" colorScheme={colorScheme}>
              {ticket.status}
            </Badge>
            <Link href={ticket.url} isExternal>
              <Text fontSize="sm" noOfLines={1} maxWidth="255px">
                {ticket.subject}
              </Text>
            </Link>
          </Flex>
          <Text fontSize="sm" align="end" noOfLines={1}>
            {moment(ticket.updated_at).fromNow(false)}
          </Text>
        </Flex>
      </Box>
    );
  };

  return (
    <>
      <Box mt="8px" maxH="256px" overflowY="scroll">
        {tickets.map((ticket) => renderTicketInfo(ticket))}
      </Box>
    </>
  );
};

export default TicketList;
