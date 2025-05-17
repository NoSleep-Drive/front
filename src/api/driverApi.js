import apiClient from './apiClient';

export const fetchDriversByDeviceUid = async (deviceUid, pageSize, pageIdx) => {
  try {
    const response = await apiClient.get(`/vehicles/${deviceUid}/drivers`, {
      params: {
        pageSize,
        pageIdx,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    if (!deviceUid) {
      console.warn('deviceUid가 undefined 또는 null입니다');
    }
    return response.data.data;
  } catch (error) {
    console.log('fetch-deviceUid:', deviceUid);
    console.error(
      '운전자 목록 불러오기에 오류 발생',
      error.response?.data?.message || error.message || '알 수 없는 오류'
    );
    if (error.response) {
      console.error('🔴 서버 응답 상태 코드:', error.response.status);
      console.error(
        '🔴 서버 응답 메시지:',
        error.response.data?.message || error.response.data
      );
      console.error('🔴 전체 응답:', error.response);
    } else if (error.request) {
      console.error('🟠 요청은 보냈지만 응답 없음:', error.request);
    } else {
      console.error('⚠️ 요청 설정 중 오류:', error.message);
    }
    throw error;
  }
};
