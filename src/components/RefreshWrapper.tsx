import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Heading,
  IconButton,
  Text,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import moment from 'moment';

interface RefreshWrapperProps<T> {
  title: string;
  onRefresh: () => Promise<T[]>;
  refreshInterval?: number;
  render: (data: T[]) => JSX.Element;
}

const RefreshWrapper = <T,>({
  title,
  onRefresh,
  refreshInterval = 0,
  render,
}: RefreshWrapperProps<T>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<T[]>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>();

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await onRefresh();
      setData(newData);
      setLastUpdatedAt(moment().format('HH:mm:ss'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    triggerRefresh();
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        triggerRefresh();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <VStack
        padding="12px"
        border="1px"
        borderColor="gray.200"
        borderRadius="16px"
        spacing="8px"
        minW="400px"
      >
        <Center w="full" justifyContent="space-between">
          <Heading size="md" color="gray.600">
            {title}
          </Heading>
          <Box>
            <Text
              fontSize="sm"
              color="gray.500"
              display="inline-block"
              mr="4px"
            >
              Updated at {lastUpdatedAt}
            </Text>
            <IconButton
              size="sm"
              isDisabled={isRefreshing}
              onClick={() => triggerRefresh()}
              aria-label="Refresh"
              icon={
                <RepeatIcon
                  animation={
                    isRefreshing ? 'rotate 2s infinite linear;' : 'none'
                  }
                />
              }
            />
          </Box>
        </Center>
        {data ? render(data) : <Skeleton minH="80px" w="100%" />}
      </VStack>
    </>
  );
};

export default RefreshWrapper;
