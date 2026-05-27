import React from 'react';
import { History } from 'lucide-react';
import type { ActivityLog } from '../../types/student';

interface HistoryTimelineProps {
  activities: ActivityLog[];
  formatActivityTime: (isoString: string) => string;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ activities, formatActivityTime }) => {
  return (
    <div className="mt-6 border-t border-border-color pt-6">
      <h4 className="flex items-center gap-2 font-bold text-text-primary text-base mb-4 font-title">
        <History size={16} className="text-primary" />
        Lịch sử cập nhật hệ thống
      </h4>
      
      <div className="relative pl-6 border-l border-border-color space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-bg-secondary" />
            
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-text-primary leading-normal">{act.action}</span>
              <span className="text-[10px] text-text-muted font-medium">{formatActivityTime(act.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
