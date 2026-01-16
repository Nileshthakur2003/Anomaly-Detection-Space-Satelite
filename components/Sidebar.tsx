
import React from 'react';
import { Satellite } from '../types';
import { SATELLITES } from '../constants';

interface SidebarProps {
  selectedSatId: string;
  onSelectSat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSatId, onSelectSat }) => {
  return (
    <aside className="w-16 hover:w-64 border-r border-[#2c3235] bg-[#111217] transition-all duration-300 group z-50">
      <div className="h-12 border-b border-[#2c3235] flex items-center px-4 overflow-hidden">
        <div className="w-8 h-8 flex-shrink-0 bg-[#f05a28] rounded flex items-center justify-center font-black text-white">O</div>
        <span className="ml-4 font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">ORBITAL GUARD</span>
      </div>

      <nav className="p-2 space-y-2">
        {SATELLITES.map((sat) => (
          <button
            key={sat.id}
            onClick={() => onSelectSat(sat.id)}
            className={`w-full flex items-center p-2 rounded transition-all ${
              selectedSatId === sat.id 
                ? 'bg-[#2c3235] text-white border-l-2 border-[#f05a28]' 
                : 'hover:bg-[#181b1f] text-[#7b8087]'
            }`}
          >
            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded ${
                sat.status === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-500'
            }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="ml-4 text-left opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                <div className="text-xs font-bold uppercase">{sat.name}</div>
                <div className="text-[10px] text-[#4c5255]">{sat.orbit} • {sat.status}</div>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
