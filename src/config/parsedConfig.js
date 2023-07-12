import config from './config';

export const API_PROTOCOL = config.apiProtocol ?? "http";
export const API_HOST = config.apiHost ?? window.location.hostname;
export const API_PORT = import.meta.env.PROD ? 443 : 8443;
export const API_BASE = `${API_PROTOCOL}://${API_HOST}:${API_PORT}`