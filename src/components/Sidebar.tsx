import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  School
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useStudents();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { id: 'students', label: 'Danh sách sinh viên', icon: Users },
    { id: 'classes', label: 'Quản lý lớp học', icon: School }
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-section">
        <div className="logo-icon">
          <GraduationCap size={24} />
        </div>
        <span className="logo-text">EduManager</span>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-links">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} style={{ flexShrink: 0 }} />
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button 
          className="theme-toggle-btn btn-icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};
