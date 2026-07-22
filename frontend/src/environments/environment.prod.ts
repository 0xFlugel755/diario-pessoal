export const environment = {
  production: true,
  // Definidas no painel do Vercel: Settings > Environment Variables
  // usando o comando `npx ng build --configuration production`
  // que substitui este arquivo via fileReplacements no angular.json.
  apiUrl: 'https://SEU-BACKEND.onrender.com/api',
  wsUrl: 'https://SEU-BACKEND.onrender.com/ws'
};
