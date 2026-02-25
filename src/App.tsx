import { Routes, Route, Navigate } from 'react-router-dom';
import { DesktopLayout } from './layouts/DesktopLayout';

function App() {
  return (
    <Routes>
      {/* All /os/* routes render the OS desktop shell */}
      <Route path="/os/*" element={<DesktopLayout />} />
      {/* Everything else redirects to the desktop */}
      <Route path="*" element={<Navigate to="/os/desktop" replace />} />
    </Routes>
  );
}

export default App;
