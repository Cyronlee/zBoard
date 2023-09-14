import React, { useEffect } from 'react';
import { Howl } from 'howler';

interface AlarmPlayer {
  src: string[];
  setIsAlarmPlayed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlarmPlayer: React.FC<AlarmPlayer> = ({ src, setIsAlarmPlayed }) => {
  useEffect(() => {
    const alarm = new Howl({ src, autoplay: true, onend: () => setIsAlarmPlayed(true) });

    return () => {
      alarm.unload();
    }
  }, [src]);

  return null;
};



export default AlarmPlayer;