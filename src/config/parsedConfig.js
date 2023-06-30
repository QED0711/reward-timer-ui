import config from './config';

export const API_PROTOCOL = config.apiProtocol ?? "http";
export const API_HOST = config.apiHost ?? window.location.hostname;
export const API_PORT = config.apiPort ?? 8000;
export const API_BASE = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`