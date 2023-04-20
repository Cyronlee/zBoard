import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Divider,
  Spacer,
  Skeleton,
  Button,
  Collapse,
  Center,
  IconButton,
  Icon,
  Grid,
  AvatarGroup,
  GridItem,
  Avatar,
  Heading,
  SystemProps,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { siteConfig } from '@/../../config/site.config';
import ThemeToggle from '@/components/ThemeToggle';
import { ChevronDownIcon, MinusIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const CollapseNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box
      bgGradient={isOpen ? '' : 'linear(to-l, #7928CA, #FF0080)'}
      w="100vw"
      h={isOpen ? '64px' : '8px'}
      transition="height 0.3s ease-out"
      onClick={() => !isOpen && setIsOpen(true)}
      cursor={isOpen ? 'default' : 'pointer'}
      borderBottom={isOpen ? '1px solid' : ''}
      borderColor="gray.200"
    >
      <Collapse in={isOpen} animateOpacity>
        <Flex justify="space-between" align="center" p="3">
          <Link href="/">
            <Heading
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="3xl"
              fontWeight="extrabold"
            >
              {siteConfig.siteName}
            </Heading>
          </Link>
          <HStack>
            <Menu>
              <MenuButton
                onClick={(event) => event.stopPropagation()}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Pages
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link href="/">Dashboard</Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/example/build-status-overview">Build Status</Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/example/ticket-status-overview">Ticket Status</Link>
                </MenuItem>
                <MenuItem>
                  <Link href="/example/project-timeline">Project Timeline</Link>
                </MenuItem>
              </MenuList>
            </Menu>
            <ThemeToggle />
            <IconButton
              aria-label="Hide Navbar"
              icon={<MinusIcon />}
              onClick={() => setIsOpen(false)}
            />
          </HStack>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default CollapseNavbar;
