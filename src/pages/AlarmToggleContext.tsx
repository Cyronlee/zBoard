import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AlarmToggleContextType {
  alarmToggle: boolean;
  setAlarmToggle: (value: boolean) => void;
}

interface AlarmToggleProviderProps {
  children: ReactNode;
}

export const AlarmToggleContext = createContext<AlarmToggleContextType>({
  alarmToggle: true,
  setAlarmToggle: () => {},
});

const AlarmToggleProvider: React.FC<AlarmToggleProviderProps> = ({ children }) => {
  const [alarmToggle, setAlarmToggle] = useState(true);

  return (
    <AlarmToggleContext.Provider value={{ alarmToggle, setAlarmToggle }}>
      {children}
    </AlarmToggleContext.Provider>
  );
};

export const useAlarmToggle = () => useContext(AlarmToggleContext);

export default AlarmToggleProvider;