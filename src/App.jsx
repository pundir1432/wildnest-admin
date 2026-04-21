import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AllRoutes } from './routes';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
