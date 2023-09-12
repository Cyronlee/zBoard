import {
  FormControl,
  FormLabel,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useAlarmToggle } from '../../pages/AlarmToggleContext';
import { WarningIcon } from '@chakra-ui/icons';

const AlarmToggle = () => {
  const { alarmToggle, setAlarmToggle } = useAlarmToggle();
  const note = `After the alarm is enabled, it will only sound during working hours 
                (9:30-11:30, 13:30-18:00 Monday to Friday). 
                The alarm will stop when the ACK button is clicked. 
                Otherwise, the alarm will repeat every 30 mins!
                `

  return (
    <>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='alarm' mb='0' display='flex' alignItems='center' w="120px" justifyContent='space-between' >
          <p>Enable Alarm</p>
          <Tooltip hasArrow label={note} bg='gray.300' color='black'>
            <WarningIcon color='gray'/>
          </Tooltip>
        </FormLabel>
        <Switch id='alarm' size='lg' isChecked={alarmToggle} onChange={() => {setAlarmToggle(!alarmToggle)}}/>
      </FormControl>
    </>
  );
};

export default AlarmToggle;
