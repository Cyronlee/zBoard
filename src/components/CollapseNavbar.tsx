import React, { useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Collapse,
  IconButton,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { siteConfig } from '@/../../config/site.config';
import ThemeToggle from '@/components/ThemeToggle';
import { ChevronDownIcon, MinusIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CollapseNavbar = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);

  const borderColor = useColorModeValue('gray.300', 'gray.400');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, url: string) => {
    e.preventDefault();
    router.push(url);
  };

  return (
    <Box
      bgGradient={isOpen ? '' : 'linear(to-l, #7928CA, #FF0080)'}
      w="100vw"
      h={isOpen ? '64px' : '8px'}
      transition="height 0.3s ease-out"
      onClick={() => !isOpen && setIsOpen(true)}
      cursor={isOpen ? 'default' : 'pointer'}
      borderBottom={isOpen ? '1px solid' : ''}
      borderColor={borderColor}
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
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Pages
              </MenuButton>
              <MenuList>
                <MenuItem onClick={(e) => handleClick(e, '/')}>
                  <Text>Dashboard</Text>
                </MenuItem>
                <MenuItem onClick={(e) => handleClick(e, '/example/build-status-overview')}>
                  <Text>Build Status</Text>
                </MenuItem>
                <MenuItem onClick={(e) => handleClick(e, '/example/ticket-status-overview')}>
                  <Text>Ticket Status</Text>
                </MenuItem>
                <MenuItem onClick={(e) => handleClick(e, '/example/project-timeline')}>
                  <Text>Project Timeline</Text>
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
