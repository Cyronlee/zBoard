import React from 'react';
import OwnerRotationCard from '@/components/OwnerRotationCard';
import { Flex, SystemProps } from '@chakra-ui/react';
import RefreshWrapper from '@/components/RefreshWrapper';
import { useErrorToast } from '@/lib/customToast';
import { CalendarIcon, EmailIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { ownerRotationConfig } from '@/../config/owner_rotation.config';

export interface Member {
  name: string;
  startDate: string;
  endDate: string;
}

export interface Rotation {
  subject: string;
  color: string;
  icon: string;
  members: Member[];
}

const softenColor = (color: string) => {
  const isHexOrSoftColor = /^#|^.*\..*$/;
  if (!isHexOrSoftColor.test(color)) {
    return `${color}.500`;
  }
  return 'blue.500';
};

const getIcon = (iconName: string, color: string) => {
  const softColor = softenColor(color);
  if (iconName === 'calendar') {
    return <CalendarIcon color={softColor} />;
  }
  if (iconName === 'email') {
    return <EmailIcon color={softColor} />;
  }
  if (iconName === 'repeat') {
    return <RepeatClockIcon color={softColor} />;
  }
  return <CalendarIcon color={softColor} />;
};

const OwnerRotationOverview = (props: SystemProps) => {
  const toastError = useErrorToast();

  const fetchData = async () => {
    const res = await fetch(`/api/owner_rotation`);
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
      h="100%"
      minW="230px"
      title={ownerRotationConfig.title || 'Owner Rotation'}
      showRefreshButton={false}
      onRefresh={() => fetchData()}
      refreshIntervalSeconds={ownerRotationConfig.refreshIntervalSeconds || 0}
      render={(data: Rotation[]) => (
        <Flex
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          overflowY="scroll"
          h="100%"
          w="100%"
          maxW="320px"
        >
          <>
            {data.map((rotation, index) => (
              <OwnerRotationCard
                key={rotation.subject}
                subject={rotation.subject}
                members={rotation.members ?? []}
                color={softenColor(rotation.color)}
                icon={getIcon(rotation.icon, rotation.color)}
              />
            ))}
          </>
        </Flex>
      )}
    ></RefreshWrapper>
  );
};

export default OwnerRotationOverview;
