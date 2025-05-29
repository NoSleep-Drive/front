import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const excludedEndpoints = ['/company/login', '/company/signup'];
  const isExcluded = excludedEndpoints.some((url) => config.url.includes(url));
  if (!isExcluded && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default apiClient;
