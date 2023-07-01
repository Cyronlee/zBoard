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
      refreshIntervalSeconds={ticketStatusConfig.refreshIntervalSeconds}
      render={ticketStatusConfig.datasource.zendesk.enabled ? showZendeskTickets : showJiraIssues}
    />
  );
};

TicketOverview.propTypes = {};

const showZendeskTickets = (tickets: Ticket[]) => {
  return (
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
  );
}

const showJiraIssues = (issues: Ticket[]) => {
  return (
      <>
        <Box w="100%">
          <StatGroup>
            <Stat>
              <StatLabel textAlign="center" fontSize="xl">Blocked</StatLabel>
              <StatNumber textAlign="center" fontSize="6xl">
                {issues.filter((i) => i.status === 'BLOCKED').length || 0}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel textAlign="center" fontSize="xl">Done</StatLabel>
              <StatNumber textAlign="center" fontSize="6xl">
                {issues.filter((i) => i.status === 'Done').length || 0}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel textAlign="center" fontSize="xl">Pending</StatLabel>
              <StatNumber textAlign="center" fontSize="6xl">
                {issues.filter((i) => i.status !== 'BLOCKED' && i.status !== 'Done').length || 0}
              </StatNumber>
            </Stat>
          </StatGroup>
        </Box>
        <TicketList tickets={issues}></TicketList>
      </>
  )
}

export default TicketOverview;
