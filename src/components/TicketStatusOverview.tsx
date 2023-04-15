import React, { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { RepeatIcon } from '@chakra-ui/icons';
import TicketList, { Ticket } from './TicketList';
import _ from 'lodash';
import { useErrorToast } from '@/lib/customToast';
import RefreshWrapper from '@/components/RefreshWrapper';
import BuildStatusCard, { BuildStatus } from '@/components/BuildStatusCard';

interface TicketOverviewData {
  new: Ticket[];
  open: Ticket[];
  pending: Ticket[];
  hold: Ticket[];
}

const TicketOverview = () => {
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
      title="Ticket Status:"
      onRefresh={fetchData}
      refreshInterval={60000}
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
