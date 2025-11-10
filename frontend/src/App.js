import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Park from './pages/park';
import Unpark from './pages/unpark';
import Status from './pages/status';
import About from './pages/about';
import Profile from './pages/profile';
import History from './pages/history';
import Signup from './pages/signup';
import Signin from './pages/signin';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/signin';

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col">
      {!isAuthPage && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicRoute><Signin /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/park" element={<ProtectedRoute><Park /></ProtectedRoute>} />
          <Route path="/unpark" element={<ProtectedRoute><Unpark /></ProtectedRoute>} />
          <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer isAuthPage={isAuthPage} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
