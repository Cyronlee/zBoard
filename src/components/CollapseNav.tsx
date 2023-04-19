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

const CollapseNav = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Heading
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="extrabold"
          >
            {siteConfig.siteName}
          </Heading>
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
                <MenuItem>Ticket Status</MenuItem>
                <MenuItem>Project Timeline</MenuItem>
                <MenuItem>Build Status</MenuItem>
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

export default CollapseNav;
