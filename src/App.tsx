import { Routes, Route } from 'react-router-dom';
import { Dashboard, Create, Editor, Share } from './pages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects" element={<Dashboard />} />
      <Route path="/create/:projectId" element={<Create />} />
      <Route path="/editor/:projectId" element={<Editor />} />
      <Route path="/share/:shareId" element={<Share />} />
    </Routes>
  );
}
