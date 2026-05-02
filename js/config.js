// Configurações da aplicação
// Detecta automaticamente o ambiente

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE = isDevelopment 
  ? 'http://localhost:3001/api'
  : 'https://api.xdstore.com/api'; // Altere para sua URL de API de produção

// Se não houver backend de produção, use vazio para usar dados do localStorage
export const USE_LOCAL_STORAGE = !isDevelopment;

