import React, { useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Center,
  Flex,
  Heading,
  IconButton,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  SystemProps,
} from '@chakra-ui/react';
import TicketList, { Ticket } from './TicketList';
import { useErrorToast } from '@/lib/customToast';
import RefreshWrapper from '@/components/RefreshWrapper';
import { zendeskConfig } from '../../config/zendesk.config';

const TicketOverview = (props: SystemProps) => {
  const toastError = useErrorToast();

  const fetchData = async () => {
    const res = await fetch('/api/ticket_status');
    if (res.ok) {
      return await res.json();
    } else {
      toastError(await res.text());
      return [];
    }
  };

  return (
    <RefreshWrapper
      {...props}
      maxWidth="448px"
      title="Ticket Status"
      onRefresh={fetchData}
      refreshIntervalSeconds={zendeskConfig.refreshIntervalSeconds}
      render={(tickets: Ticket[]) => (
        <>
          <Box w="100%">
            <StatGroup>
              <Stat>
                <StatLabel fontSize="xl">New</StatLabel>
                <StatNumber fontSize="6xl">
                  {tickets.filter((t) => t.status === 'new').length || 0}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="xl">Open</StatLabel>
                <StatNumber fontSize="6xl">
                  {tickets.filter((t) => t.status === 'open').length || 0}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="xl">Pending</StatLabel>
                <StatNumber fontSize="6xl">
                  {tickets.filter((t) => t.status === 'pending').length || 0}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Box>
          <TicketList tickets={tickets}></TicketList>
        </>
      )}
    />
  );
};

TicketOverview.propTypes = {};

export default TicketOverview;
