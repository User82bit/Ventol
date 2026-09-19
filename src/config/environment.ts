// Use an environment variable in production, fallback to a sensible default for development
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.5:5171';
export const CAMERA_STREAM_URL = process.env.EXPO_PUBLIC_CAMERA_URL || 'http://192.168.1.6:81/stream';
