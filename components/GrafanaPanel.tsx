
import React from 'react';

interface GrafanaPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const GrafanaPanel: React.FC<GrafanaPanelProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`grafana-panel flex flex-col h-full ${className}`}>
      <div className="grafana-header flex justify-between items-center">
        <span>{title}</span>
        <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></span>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        {children}
      </div>
    </div>
  );
};

export default GrafanaPanel;
