import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AvailableSpaces from './pages/AvailableSpaces';
import OccupiedSpaces from './pages/OccupiedSpaces';
import Billing from './pages/Billing';
import './App.css';

function App() {
  return (
    <ParkingProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/available" element={<AvailableSpaces />} />
            <Route path="/occupied" element={<OccupiedSpaces />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </Layout>
      </Router>
    </ParkingProvider>
  );
}

export default App;
