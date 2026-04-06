import { Routes, Route } from 'react-router-dom';
import InfoPage from './pages/InfoPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InfoPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;