import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Park from './pages/park';
import Unpark from './pages/unpark';
import Status from './pages/status';
import About from './pages/about';
import Profile from './pages/profile';
import History from './pages/history';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/park" element={<Park />} />
            <Route path="/unpark" element={<Unpark />} />
            <Route path="/status" element={<Status />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/history" element={<History />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
