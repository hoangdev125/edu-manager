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
      colorClass: 'blue',
      desc: 'Sinh viên đang quản lý'
    },
    {
      title: 'Số lớp học',
      value: stats.totalClasses,
      icon: BookOpen,
      colorClass: 'teal',
      desc: 'Các lớp thuộc các khoa'
    },
    {
      title: 'Điểm GPA trung bình',
      value: stats.averageGpa,
      icon: Award,
      colorClass: 'purple',
      desc: 'Thang điểm hệ 4.0'
    },
    {
      title: 'Tỷ lệ chuyên cần',
      value: `${stats.attendanceRate}%`,
      icon: Calendar,
      colorClass: 'amber',
      desc: 'Đánh giá điểm danh'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stat Cards Grid */}
      <div className="stats-grid">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card stat-card">
              <div className={`stat-icon-wrapper ${card.colorClass}`}>
                <Icon size={24} />
              </div>
              <div className="stat-data">
                <span className="stat-title">{card.title}</span>
                <span className="stat-value">{card.value}</span>
                <span className="student-sub-text" style={{ fontSize: '11px' }}>{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="dashboard-details-grid">
        {/* Analytics Chart */}
        <div>
          <AnalyticsChart students={students} />
        </div>

        {/* Recent Activities Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={20} className="empty-state-icon" style={{ margin: 0, color: 'var(--primary)' }} />
              Hoạt động gần đây
            </h3>
          </div>

          <div style={{ flex: 1 }}>
            {recentActivities.length > 0 ? (
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-badge" />
                    <div className="activity-content">
                      <span className="activity-desc">
                        <strong style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setActiveTab('students')}>
                          {act.studentName}
                        </strong>{' '}
                        - {act.action}
                      </span>
                      <span className="activity-time">{formatTime(act.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <Activity size={32} className="empty-state-icon" />
                <p className="empty-state-title" style={{ fontSize: '14px' }}>Không có hoạt động</p>
                <p className="empty-state-desc" style={{ fontSize: '12px', margin: 0 }}>Các hành động sửa/xóa/thêm sẽ xuất hiện ở đây.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Truy cập nhanh</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Chuyển đổi nhanh đến các tính năng khác.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('classes')}>
            Xem danh sách lớp học
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('students')}>
            <UserPlus size={16} />
            Quản lý danh sách sinh viên
          </button>
        </div>
      </div>
    </div>
  );
};
