import { useEffect, useState } from 'react';
import {
  Box,
  Center,
  Heading,
  IconButton,
  Text,
  VStack,
  Skeleton,
  SystemProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import moment from 'moment';

interface RefreshWrapperProps<T> {
  title: string;
  onRefresh: () => Promise<T[]>;
  refreshInterval?: number;
  render: (data: T[]) => JSX.Element;
  [key: string]: any;
}

const RefreshWrapper = <T,>({
  title,
  onRefresh,
  refreshInterval = 0,
  render,
  ...props
}: RefreshWrapperProps<T>) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>();

  const borderColor = useColorModeValue('gray.300', 'gray.400');
  const fontColor = useColorModeValue('gray.600', 'gray.300');

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
        borderColor={borderColor}
        borderRadius="16px"
        spacing="8px"
        w="100%"
        {...props}
      >
        <Center w="100%" justifyContent="space-between">
          <Heading size="md" color={fontColor}>
            {title}
          </Heading>
          <Box>
            <Text fontSize="sm" color={fontColor} display="inline-block" mr="4px">
              Updated at {lastUpdatedAt}
            </Text>
            <IconButton
              size="sm"
              isDisabled={isRefreshing}
              cursor={isRefreshing ? 'wait !important' : 'pointer'}
              onClick={() => triggerRefresh()}
              aria-label="Refresh"
              icon={<RepeatIcon animation={isRefreshing ? 'rotate 2s infinite linear;' : 'none'} />}
            />
          </Box>
        </Center>
        {data.length > 0 ? render(data) : <Skeleton h="100%" w="100%" />}
      </VStack>
    </>
  );
};

export default RefreshWrapper;
