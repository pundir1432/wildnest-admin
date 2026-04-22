import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const formatTime = (iso) => {
  if (!iso) return '';
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)  return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return new Date(iso).toLocaleDateString('en-IN');
};

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const socket = io(BASE_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('new_booking', (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        type: 'new_booking',
        text: data.message || `New ${data.booking?.bookingType || ''} booking`,
        meta: `₹${(data.booking?.totalAmount || 0).toLocaleString()}`,
        time: formatTime(data.createdAt),
        rawTime: data.createdAt || new Date().toISOString(),
        unread: true,
      }, ...prev].slice(0, 50));
    });

    socket.on('new_user', (data) => {
      setNotifications(prev => [{
        id: Date.now() + 1,
        type: 'new_user',
        text: data.message || `New user: ${data.user?.name || ''}`,
        meta: data.user?.email || '',
        time: formatTime(data.createdAt),
        rawTime: data.createdAt || new Date().toISOString(),
        unread: true,
      }, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, []);

  const markAllRead  = () => setNotifications(p => p.map(n => ({ ...n, unread: false })));
  const clearAll     = () => setNotifications([]);
  const dismiss      = (id) => setNotifications(p => p.filter(n => n.id !== id));
  const unreadCount  = notifications.filter(n => n.unread).length;

  return (
    <SocketContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll, dismiss }}>
      {children}
    </SocketContext.Provider>
  );
};
