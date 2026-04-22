import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AllRoutes } from './routes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AllRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
