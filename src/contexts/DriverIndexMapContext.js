import { createContext } from 'react';

export const DriverIndexMapContext = createContext({
  driverIndexMapRef: { current: {} },
  setDriverIndexMap: () => {},
});
