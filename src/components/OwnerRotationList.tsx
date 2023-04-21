import React from 'react';
import OwnerRotation from '@/components/OwnerRotation';
import { Flex, SystemProps } from '@chakra-ui/react';
import RefreshWrapper from '@/components/RefreshWrapper';
import { useErrorToast } from '@/lib/customToast';
import { CalendarIcon, EmailIcon, RepeatClockIcon } from '@chakra-ui/icons';

export interface RotationOwner {
  cname: string;
  ename: string;
  is_owner: number;
  [key: string]: any;
}

export interface RotationOwners {
  ownerType: string;
  owners: RotationOwner[];
}

const colorSchemas = ['teal.500', 'blue.500', 'purple.500'];

const icons = [
  {
    color: colorSchemas[0],
    icon: <CalendarIcon color={colorSchemas[0]} />,
  },
  {
    color: colorSchemas[1],
    icon: <EmailIcon color={colorSchemas[1]} />,
  },
  {
    color: colorSchemas[2],
    icon: <RepeatClockIcon color={colorSchemas[2]} />,
  },
];

const OwnerRotationList = (props: SystemProps) => {
  const toastError = useErrorToast();

  const fetchData = async () => {
    const res = await fetch('/api/owner_rotation');
    if (res.ok) {
      return await res.json();
    } else {
      toastError(await res.text());
      return [];
    }
  };

  const findCurrentOwner = (data: RotationOwner[]) => {
    return data?.findIndex((it) => it.is_owner === 1) ?? 0;
  };

  return (
    <RefreshWrapper
      {...props}
      h="100%"
      minW="230px"
      title="Owner Rotation:"
      isRefresh={false}
      onRefresh={() => fetchData()}
      refreshInterval={0}
      render={(data: RotationOwners[]) => (
        <Flex
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
          overflowY="scroll"
          h="100%"
        >
          <>
            {data.map((item, index) => (
              <OwnerRotation
                key={item.ownerType}
                ownerType={item.ownerType}
                owners={item.owners ?? []}
                current={findCurrentOwner(item.owners)}
                colorScheme={icons[index % icons.length].color}
                icon={icons[index % icons.length].icon}
              />
            ))}
          </>
        </Flex>
      )}
    ></RefreshWrapper>
  );
};

export default OwnerRotationList;
