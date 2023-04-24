import React, { ReactNode, useEffect, useState } from 'react';
import { Box, Card, CardBody, Center, Heading, HStack, Text } from '@chakra-ui/react';
import { RotationOwner } from '@/components/OwnerRotationOverview';

interface OwnerRotationProps {
  ownerType: string;
  owners: RotationOwner[];
  colorScheme: string;
  icon: ReactNode;
}

const OwnerRotationCard = ({ ownerType, owners, colorScheme, icon }: OwnerRotationProps) => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const findOwner = (index: number) => {
    return owners[(index + owners.length) % owners.length];
  };

  useEffect(() => {
    setCurrentIndex(owners.findIndex((it) => it.isOwner) ?? 0);
  }, [owners]);

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      w="100%"
      h="180px"
      maxW="320px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      variant="outline"
    >
      <Box w="12px" bg={colorScheme}></Box>
      <HStack>
        <CardBody px="15px">
          <Heading size="md" fontWeight="light" position="absolute" top="12px">
            <HStack>
              {icon}
              <Text whiteSpace="nowrap">{ownerType}</Text>
            </HStack>
          </Heading>
          <Text
            mt="8"
            pl="4"
            fontSize="20px"
            color="gray"
            whiteSpace="nowrap"
            overflow="hidden"
            // textOverflow="ellipsis"
            maxW="150px"
          >
            {findOwner(currentIndex - 1)?.name}
          </Text>
          <Card
            direction={{ base: 'column', sm: 'row' }}
            my="1"
            borderWidth="0"
            borderRadius="sm"
            boxShadow="0"
          >
            <Box w="8px" bg="gray"></Box>
            <Center bg={'gray.300'} ml="1">
              <Text
                px="1"
                fontWeight="bold"
                fontSize="20px"
                whiteSpace="nowrap"
                overflow="hidden"
                // textOverflow="ellipsis"
                maxW="150px"
              >
                {findOwner(currentIndex)?.name}
              </Text>
            </Center>
          </Card>
          <Text
            pl="4"
            fontSize="20px"
            color="gray"
            whiteSpace="nowrap"
            overflow="hidden"
            // textOverflow="ellipsis"
            maxW="150px"
          >
            {findOwner(currentIndex + 1)?.name}
          </Text>
        </CardBody>
      </HStack>
    </Card>
  );
};

export default OwnerRotationCard;