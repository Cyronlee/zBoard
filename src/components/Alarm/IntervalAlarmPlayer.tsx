import React, { useEffect, useRef, useState } from 'react';
import AlarmPlayer from './AlarmPlayer';

interface IntervalAlarmPlayerProps {
  intervalMin?: number;
  alarmSrc?: string[];
}

const IntervalAlarmPlayer: React.FC<IntervalAlarmPlayerProps> = ({ intervalMin = 30, alarmSrc= ['/audio/mayday.mp3'] }) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isAlarmPlayed, setIsAlarmPlayed] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {setIsAlarmPlayed(false)}, intervalMin * 60 * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (isAlarmPlayed) {
    return null
  } else {
    return <AlarmPlayer src={alarmSrc} setIsAlarmPlayed={setIsAlarmPlayed} />;
  }

};

export default IntervalAlarmPlayer;