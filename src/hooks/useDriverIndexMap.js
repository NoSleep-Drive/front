import { useContext } from 'react';
import { DriverIndexMapContext } from '../contexts/DriverIndexMapContext';

export default function useDriverIndexMap() {
  const context = useContext(DriverIndexMapContext);
  if (!context) {
    throw new Error(
      'useDriverIndexMap must be used within a DriverIndexMapContext.Provider'
    );
  }
  return context;
}
