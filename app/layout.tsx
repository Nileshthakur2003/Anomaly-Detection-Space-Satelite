
import React from 'react';
import Sidebar from '../components/layout/Sidebar';

const RootLayout: React.FC<{ children: React.ReactNode; selectedSatId: string; onSelectSat: (id: string) => void }> = ({ children, selectedSatId, onSelectSat }) => {
  return (
    <div className="flex h-screen bg-[#0b0c0e] text-[#d8d9da] font-sans selection:bg-cyan-500/30">
      <Sidebar selectedSatId={selectedSatId} onSelectSat={onSelectSat} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
