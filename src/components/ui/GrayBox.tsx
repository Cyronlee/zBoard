import React from 'react';
import { Center } from '@chakra-ui/react';

const GrayBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Center bg="gray.200" w="100%" h="100%">
      {children}
    </Center>
  );
};

export default GrayBox;
