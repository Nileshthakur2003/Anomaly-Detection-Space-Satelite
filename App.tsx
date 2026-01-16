
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { SATELLITES } from './constants';

const App: React.FC = () => {
  const [selectedSatId, setSelectedSatId] = useState<string>(SATELLITES[0].id);

  const selectedSatellite = SATELLITES.find(s => s.id === selectedSatId) || SATELLITES[0];

  return (
    <div className="flex h-screen bg-[#0b0c0e] text-[#d8d9da] overflow-hidden">
      {/* Sidebar acts as the 'Nav' in Next.js terms */}
      <Sidebar 
        selectedSatId={selectedSatId} 
        onSelectSat={setSelectedSatId} 
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Dashboard satellite={selectedSatellite} />
      </main>
    </div>
  );
};

export default App;
