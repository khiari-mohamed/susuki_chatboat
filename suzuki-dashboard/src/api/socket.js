import { io } from 'socket.io-client';
import { API_URL, getToken } from './client';

let socket = null;

/**
 * Lazily creates (or reuses) the single socket.io connection to the
 * /admin namespace, authenticated with the current JWT. Called once
 * from AuthContext right after login / on app load with a valid token.
 */
export function connectSocket() {
  const token = getToken();
  if (!token) return null;

  if (socket && socket.connected) return socket;

  socket = io(`${API_URL}/admin`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1500,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
