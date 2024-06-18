const apiUrl = 'http://localhost:8080';

export const environment = {
  production: false,
  apiUrl: apiUrl,
  wsUrl: apiUrl.replace(/^http/, 'ws')
};