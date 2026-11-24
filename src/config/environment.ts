// URL pública HTTPS do Adan-Stella. Pode ser substituída no build por
// EXPO_PUBLIC_API_URL, sem colocar credenciais no aplicativo.
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  'https://desktop-s66k8c7.tailc423e9.ts.net'
).trim().replace(/\/+$/, '');

export const CAMERA_STREAM_URL =
  process.env.EXPO_PUBLIC_CAMERA_URL || 'http://192.168.1.6:81/stream';
