import { Center, Heading } from '@chakra-ui/react';

export default function Home() {
  return (
    <Center w="100vw" h="100vh">
      <Heading
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        fontSize="5xl"
        fontWeight="extrabold"
      >
        zBoard
      </Heading>
    </Center>
  );
}
