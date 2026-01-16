
import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  status?: 'ok' | 'warn' | 'error';
}

const Panel: React.FC<PanelProps> = ({ title, children, className = "", status = 'ok' }) => {
  const statusColors = {
    ok: 'bg-[#73bf69]',
    warn: 'bg-[#ff9830]',
    error: 'bg-[#f2495c]'
  };

  return (
    <div className={`bg-[#181b1f] border border-[#2c3235] rounded-sm flex flex-col h-full overflow-hidden ${className}`}>
      <div className="bg-[#111217] border-b border-[#2c3235] px-3 py-1.5 flex justify-between items-center">
        <span className="text-[10px] font-bold text-[#9fefdf] uppercase tracking-wider">{title}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`}></div>
      </div>
      <div className="flex-1 relative min-h-0">
        {children}
      </div>
    </div>
  );
};

export default Panel;
