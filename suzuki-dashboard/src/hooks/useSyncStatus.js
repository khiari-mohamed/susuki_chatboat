import { useCallback, useEffect, useState } from 'react';
import client from '../api/client';
import { getSocket } from '../api/socket';

const RUNNING_POLL_MS = 3000;
const IDLE_POLL_MS = 60000;

/**
 * Sync status shared by the dashboard, the sync page and the ERP entity pages.
 * Refreshes on socket events for the 'sync' channel, and by polling as a fallback
 * (fast while a run is in progress, slow otherwise, so a nightly run is noticed too).
 */
export default function useSyncStatus() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await client.get('/sync/status');
      setStatus(data);
      setError('');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Statut de synchronisation indisponible');
      return null;
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const id = setInterval(load, status?.running ? RUNNING_POLL_MS : IDLE_POLL_MS);
    return () => clearInterval(id);
  }, [status?.running, load]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;
    const onChange = (payload) => { if (payload?.table === 'sync') load(); };
    socket.on('record:changed', onChange);
    return () => socket.off('record:changed', onChange);
  }, [load]);

  return { status, error, reload: load };
}