const apiUrl = 'https://bb21-145-94-189-214.ngrok-free.app';

export const environment = {
  production: false,
  apiUrl: apiUrl,
  wsUrl: apiUrl.replace(/^http/, apiUrl.startsWith('https') ? 'wss' : 'ws')
};
