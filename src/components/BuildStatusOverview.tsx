import { Flex, BoxProps, SystemProps } from '@chakra-ui/react';
import BuildStatusCard, { BuildStatus } from '@/components/BuildStatusCard';
import RefreshWrapper from '@/components/RefreshWrapper';
import { useErrorToast } from '@/lib/customToast';

const BuildStatusOverview = (props: SystemProps) => {
  const toastError = useErrorToast();

  const fetchData = async () => {
    const res = await fetch('/api/build_status');
    if (res.ok) {
      return await res.json();
    } else {
      toastError(await res.text());
      return [];
    }
  };

  return (
    <RefreshWrapper
      {...props}
      title="Build Status:"
      onRefresh={fetchData}
      refreshInterval={60000}
      render={(data: BuildStatus[]) => (
        <>
          <Flex
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            overflowY="scroll"
            height="100%"
          >
            {data.map((item, index) => (
              <BuildStatusCard key={index} buildStatus={item} />
            ))}
          </Flex>
        </>
      )}
    />
  );
};

export default BuildStatusOverview;
