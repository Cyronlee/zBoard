import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const cookies = new Cookies();
    cookies.set('site_password', password);
    router.reload();
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Enter site password
        </Heading>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Stack spacing={6}>
          <Button colorScheme="blue" onClick={(params) => handleLogin()}>
            Login
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Login;
