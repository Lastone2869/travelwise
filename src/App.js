import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DestinationsPage from './pages/DestinationsPage';
import SubdestinationsPage from './pages/SubdestinationsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:destinationId" element={<SubdestinationsPage />} />
      </Routes>
    </Router>
  );
}

export default App;