
import React from 'react';
import { SATELLITES } from '../../lib/constants';

interface SidebarProps {
  selectedSatId: string;
  onSelectSat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedSatId, onSelectSat }) => {
  return (
    <nav className="w-16 hover:w-60 border-r border-[#2c3235] bg-[#111217] transition-all duration-300 group z-50 flex flex-col">
      <div className="h-12 border-b border-[#2c3235] flex items-center px-4 overflow-hidden bg-[#1a1d21]">
        <div className="w-6 h-6 flex-shrink-0 bg-cyan-600 rounded-sm flex items-center justify-center font-black text-white text-[10px]">OG</div>
        <span className="ml-3 font-bold text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Mission Control</span>
      </div>

      <div className="flex-1 p-2 space-y-2">
        {SATELLITES.map((sat) => (
          <button
            key={sat.id}
            onClick={() => onSelectSat(sat.id)}
            className={`w-full flex items-center p-2 rounded-sm transition-all border-l-2 ${
              selectedSatId === sat.id 
                ? 'bg-[#2c3235] border-cyan-500 text-white' 
                : 'hover:bg-[#181b1f] border-transparent text-[#7b8087]'
            }`}
          >
            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-sm ${
                sat.status === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/10 text-blue-400'
            }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.675.337a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.023.547l-1.42 1.42a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 001.022 1.022l2.387.477a6 6 0 003.86-.517l.675-.337a6 6 0 013.86-.517l2.388.477a2 2 0 001.023-.547l1.42-1.42a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.022-1.022l-2.387-.477a2 2 0 00-1.022-.547z" />
                </svg>
            </div>
            <div className="ml-4 text-left opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                <div className="text-[11px] font-bold uppercase leading-none">{sat.name}</div>
                <div className="text-[9px] text-[#4c5255] mt-1 tracking-tight">{sat.orbit} • {sat.id}</div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-3 border-t border-[#2c3235] text-[9px] text-[#4c5255] opacity-0 group-hover:opacity-100 uppercase font-bold tracking-widest text-center">
        V4.2.0-STABLE
      </div>
    </nav>
  );
};

export default Sidebar;
