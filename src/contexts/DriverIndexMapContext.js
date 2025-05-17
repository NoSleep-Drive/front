import { createContext } from 'react';
// DriverIndexMapContext: 운전자 해시와 인덱스 간의 매핑 관리
// driverIndexMapRef: 드라이버 해시를 키로, 인덱스를 값으로 가지는 객체에 대한 참조
// setDriverIndexMap: 운전자 인덱스 설정(App.에서 사용)
export const DriverIndexMapContext = createContext({
  driverIndexMapRef: { current: {} },
  setDriverIndexMap: () => {},
});
