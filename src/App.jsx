import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import MigrationPrompt from './components/MigrationPrompt';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CardList from './pages/CardList';
import NewCard from './pages/NewCard';
import EditCard from './pages/EditCard';
import ImportCards from './pages/ImportCards';
import PracticeSetup from './pages/PracticeSetup';
import PracticeGame from './pages/PracticeGame';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SyncProvider>
          <MigrationPrompt />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="manage" element={
                <ProtectedRoute>
                  <CardList />
                </ProtectedRoute>
              } />
              <Route path="manage/new" element={
                <ProtectedRoute>
                  <NewCard />
                </ProtectedRoute>
              } />
              <Route path="manage/edit/:id" element={
                <ProtectedRoute>
                  <EditCard />
                </ProtectedRoute>
              } />
              <Route path="manage/import" element={
                <ProtectedRoute>
                  <ImportCards />
                </ProtectedRoute>
              } />
              <Route path="practice/setup" element={
                <ProtectedRoute>
                  <PracticeSetup />
                </ProtectedRoute>
              } />
              <Route path="practice/game" element={
                <ProtectedRoute>
                  <PracticeGame />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </SyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
