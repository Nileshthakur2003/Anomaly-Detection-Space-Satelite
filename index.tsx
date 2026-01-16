
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import RootLayout from './app/layout';
import DashboardPage from './app/page';
import { SATELLITES } from './lib/constants';

const App = () => {
  const [selectedSatId, setSelectedSatId] = useState<string>(SATELLITES[0].id);
  const selectedSatellite = SATELLITES.find(s => s.id === selectedSatId) || SATELLITES[0];

  return (
    <RootLayout selectedSatId={selectedSatId} onSelectSat={setSelectedSatId}>
      <DashboardPage satellite={selectedSatellite} />
    </RootLayout>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
