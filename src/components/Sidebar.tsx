import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  School,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useStudents();
  const { currentUser, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Render role-based navigation menu
  const menuItems = currentUser?.role === 'admin' 
    ? [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
        { id: 'students', label: 'Danh sách sinh viên', icon: Users },
        { id: 'classes', label: 'Quản lý lớp học', icon: School }
      ]
    : [
        { id: 'profile', label: 'Hồ sơ của tôi', icon: UserCheck }
      ];

  return (
    <aside className={`h-screen fixed left-0 top-0 bg-bg-secondary border-r border-border-color flex flex-col p-4 z-[100] transition-all duration-300 max-[576px]:hidden ${
      isCollapsed ? 'w-[80px]' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3 pb-6 mb-6 border-b border-border-color">
        <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center text-white shadow-[0_4px_12px_var(--primary-glow)] shrink-0">
          <School size={20} />
        </div>
        <span className={`font-title text-xl font-extrabold bg-accent-gradient bg-clip-text text-transparent whitespace-nowrap transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 w-0 pointer-events-none overflow-hidden' : 'opacity-100'
        }`}>
          Edu Manager
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            // For student, it is always active on 'profile' tab simulation
            const isActive = currentUser?.role === 'admin' ? activeTab === item.id : true;
            return (
              <li key={item.id} className="w-full">
                <button
                  onClick={() => currentUser?.role === 'admin' && setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border-none font-semibold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-accent-gradient text-white shadow-[0_4px_15px_var(--primary-glow)]' 
                      : 'bg-transparent text-text-secondary hover:bg-input-bg hover:text-text-primary'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className={`transition-opacity duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 pointer-events-none overflow-hidden' : 'opacity-100'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`pt-4 border-t border-border-color flex items-center gap-2 ${
        isCollapsed ? 'justify-center flex-col' : 'justify-between'
      }`}>
        <button 
          className="w-10 h-10 rounded-xl border border-border-color bg-bg-secondary text-[#ef4444] hover:text-white hover:bg-[#ef4444] flex items-center justify-center cursor-pointer transition-all duration-200"
          onClick={logout}
          title="Đăng xuất tài khoản"
        >
          <LogOut size={20} />
        </button>

        <button 
          className="w-10 h-10 rounded-xl border border-border-color bg-bg-secondary text-text-primary flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-input-bg hover:border-text-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </aside>
  );
};
