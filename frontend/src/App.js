import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/park" element={<Park />} />
            <Route path="/unpark" element={<Unpark />} />
            <Route path="/status" element={<Status />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Placeholder components
const Home = () => <div className="text-center"><h1 className="text-4xl font-bold text-gray-800">Welcome to QuickPark</h1></div>;
const Park = () => <div className="text-center"><h1 className="text-3xl font-bold text-gray-800">Park Your Vehicle</h1></div>;
const Unpark = () => <div className="text-center"><h1 className="text-3xl font-bold text-gray-800">Unpark Your Vehicle</h1></div>;
const Status = () => <div className="text-center"><h1 className="text-3xl font-bold text-gray-800">Parking Status</h1></div>;
const About = () => <div className="text-center"><h1 className="text-3xl font-bold text-gray-800">About QuickPark</h1></div>;
const Profile = () => <div className="text-center"><h1 className="text-3xl font-bold text-gray-800">User Profile</h1></div>;

export default App;
