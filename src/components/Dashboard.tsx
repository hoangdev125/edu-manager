import React from 'react';
import { useStudents } from '../context/StudentContext';
import { AnalyticsChart } from './AnalyticsChart';
import { 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  Activity,
  UserPlus
} from 'lucide-react';
import type { ActivityLog } from '../types/student';

export const Dashboard: React.FC = () => {
  const { students, stats, setActiveTab } = useStudents();

  // Combine and sort activities from all students
  const allActivities: (ActivityLog & { studentName: string; studentId: string })[] = [];
  students.forEach(student => {
    student.activities.forEach(activity => {
      allActivities.push({
        ...activity,
        studentName: student.name,
        studentId: student.id
      });
    });
  });

  // Sort by date descending
  const recentActivities = allActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const statCards = [
    {
      title: 'Tổng số sinh viên',
      value: stats.totalStudents,
      icon: Users,
      colorClass: 'from-blue-500 to-blue-700 shadow-[0_4px_12px_rgba(59,130,246,0.25)]',
      desc: 'Sinh viên đang quản lý'
    },
    {
      title: 'Số lớp học',
      value: stats.totalClasses,
      icon: BookOpen,
      colorClass: 'from-teal-500 to-teal-700 shadow-[0_4px_12px_rgba(20,184,166,0.25)]',
      desc: 'Các lớp thuộc các khoa'
    },
    {
      title: 'Điểm GPA trung bình',
      value: stats.averageGpa,
      icon: Award,
      colorClass: 'from-purple-500 to-purple-700 shadow-[0_4px_12px_rgba(168,85,247,0.25)]',
      desc: 'Thang điểm hệ 4.0'
    },
    {
      title: 'Tỷ lệ chuyên cần',
      value: `${stats.attendanceRate}%`,
      icon: Calendar,
      colorClass: 'from-amber-500 to-amber-700 shadow-[0_4px_12px_rgba(245,158,11,0.25)]',
      desc: 'Đánh giá điểm danh'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${card.colorClass}`}>
                <Icon size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-text-secondary font-semibold mb-1 font-body">{card.title}</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary font-title leading-none">{card.value}</span>
                <span className="text-[10px] text-text-muted mt-1.5 font-medium">{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2">
          <AnalyticsChart students={students} />
        </div>

        {/* Recent Activities Card */}
        <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex flex-col hover:bg-card-hover-bg transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 font-title">
              <Activity size={20} className="text-primary" />
              Hoạt động gần đây
            </h3>
          </div>

          <div className="flex-1">
            {recentActivities.length > 0 ? (
              <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 pb-3 border-b border-dashed border-border-color last:border-b-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs sm:text-sm text-text-primary font-medium">
                        <strong className="font-bold text-primary hover:underline cursor-pointer" onClick={() => setActiveTab('students')}>
                          {act.studentName}
                        </strong>{' '}
                        {act.action}
                      </span>
                      <span className="text-[10px] text-text-muted font-semibold mt-0.5">{formatTime(act.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <Activity size={32} className="text-text-muted opacity-40 animate-pulse" />
                <p className="font-semibold text-xs sm:text-sm text-text-secondary">Không có hoạt động</p>
                <p className="text-[11px] text-text-muted max-w-[200px]">Các hành động sửa/xóa/thêm sẽ xuất hiện ở đây.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-card-hover-bg transition-all duration-300">
        <div>
          <h3 className="text-base font-bold text-text-primary font-title mb-1">Truy cập nhanh</h3>
          <p className="color-text-secondary text-xs sm:text-sm text-text-secondary font-medium">Chuyển đổi nhanh đến các tính năng khác.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none h-11 px-5 rounded-xl font-semibold bg-bg-secondary border border-border-color text-text-primary hover:bg-input-bg transition-colors duration-200 cursor-pointer text-xs sm:text-sm whitespace-nowrap" onClick={() => setActiveTab('classes')}>
            Xem danh sách lớp học
          </button>
          <button className="flex-1 sm:flex-none h-11 px-5 rounded-xl font-semibold bg-accent-gradient text-white hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 whitespace-nowrap cursor-pointer text-xs sm:text-sm inline-flex items-center justify-center gap-2" onClick={() => setActiveTab('students')}>
            <UserPlus size={16} />
            Quản lý sinh viên
          </button>
        </div>
      </div>
    </div>
  );
};
