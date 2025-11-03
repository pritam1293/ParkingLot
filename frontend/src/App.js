import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/park" element={<Park />} />
          <Route path="/unpark" element={<Unpark />} />
          <Route path="/status" element={<Status />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/history" element={<History />} />
        </Routes>
      </div>
      <Footer isAuthPage={isAuthPage} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
