import React, { useEffect, useRef } from 'react';
import { Button, Flex, Heading, Input, Stack, useColorModeValue } from '@chakra-ui/react';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.addEventListener('keydown', handleLoginKeyDown);
    return () => {
      document.removeEventListener('keydown', handleLoginKeyDown);
    };
  }, []);

  const handleLoginKeyDown = (e: any) => {
    if (e.key == 'Enter') handleLogin();
  };

  const handleLogin = () => {
    if (passwordInputRef.current === undefined) return;
    const cookies = new Cookies();
    const passwordInput = passwordInputRef.current;
    cookies.set('site_password', passwordInput?.value);
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
        <Input ref={passwordInputRef} type="password" />
        <Stack spacing={6}>
          <Button colorScheme="blue" onClick={() => handleLogin()}>
            Login
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Login;
