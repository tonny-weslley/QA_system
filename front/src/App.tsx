import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/context/AuthContext';
import { WebSocketProvider } from './lib/context/WebSocketContext';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Questions } from './components/pages/Questions';
import { QuestionDetail } from './components/pages/QuestionDetail';
import { Scoreboard } from './components/pages/Scoreboard';
import { PodiumPage } from './components/pages/PodiumPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { AdminQuestionsPage } from './components/pages/AdminQuestionsPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple"></div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-halloween-purple"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/questions" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/questions"
        element={
          <PrivateRoute>
            <Questions />
          </PrivateRoute>
        }
      />
      <Route
        path="/questions/:id"
        element={
          <PrivateRoute>
            <QuestionDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/scoreboard"
        element={
          <PrivateRoute>
            <Scoreboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/podium"
        element={
          <PrivateRoute>
            <PodiumPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/questions"
        element={
          <PrivateRoute>
            <AdminRoute>
              <AdminQuestionsPage />
            </AdminRoute>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/questions" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
