import { SystemProps, Grid } from '@chakra-ui/react';
import BuildStatusCard, { BuildStatus } from '@/components/BuildStatusCard';
import RefreshWrapper from '@/components/RefreshWrapper';
import { buildStatusConfig } from '../../config/build_status.config';
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
      title={buildStatusConfig.title || 'Build Status'}
      onRefresh={fetchData}
      refreshIntervalSeconds={buildStatusConfig.refreshIntervalSeconds || 0}
      remainOldDataOnError={true}
      render={(data: BuildStatus[]) => (
        <>
          <Grid
            overflowY="scroll"
            height="100%"
            width="100%"
            rowGap="18px"
            columnGap="24px"
            gridTemplateColumns="repeat(auto-fit, minmax(320px, 1fr))"
          >
            {data.map((item, index) => (
              <BuildStatusCard key={index} buildStatus={item} />
            ))}
          </Grid>
        </>
      )}
    />
  );
};

export default BuildStatusOverview;
