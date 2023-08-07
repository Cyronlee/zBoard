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
import { ticketStatusConfig } from '../../config/ticket_status.config';
import moment from 'moment';

const TicketOverview = (props: SystemProps) => {
  const toastError = useErrorToast();

  const fetchData = async () => {
    let lastFetchTicketStatusTime = localStorage.getItem('zboard:last_fetch_ticket_status_time');
    const res = await fetch('/api/ticket_status?lastFetchTime=' + lastFetchTicketStatusTime);
    if (res.ok) {
      localStorage.setItem('zboard:last_fetch_ticket_status_time', moment().format());
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
      refreshIntervalSeconds={ticketStatusConfig.refreshIntervalSeconds}
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
