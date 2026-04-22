import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;
  socket = io(SOCKET_URL, { transports: ["websocket"] });
  return socket;
};

export const joinAdminRoom = () => {
  if (socket) socket.emit("join_admin");
};

export const onNewBooking = (cb) => {
  if (socket) socket.on("new_booking", cb);
};

export const onNewUser = (cb) => {
  if (socket) socket.on("new_user", cb);
};

export const clearNotifications = () => {
  if (socket) socket.emit("clear_notifications");
};

export const offNotifications = () => {
  if (socket) {
    socket.off("new_booking");
    socket.off("new_user");
  }
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const getSocket = () => socket;
