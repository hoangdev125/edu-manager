import React from "react";
import { useStudents } from "../context/StudentContext";
import { Sun, Moon } from "lucide-react";
import avt from "../assets/avt.jpg";
export const Header: React.FC = () => {
  const { activeTab, theme, toggleTheme } = useStudents();

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Bảng điều khiển";
      case "students":
        return "Quản lý sinh viên";
      case "classes":
        return "Quản lý lớp học";
      default:
        return "EduManager";
    }
  };

  const getSubtitle = () => {
    const today = new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    switch (activeTab) {
      case "dashboard":
        return `Chào mừng quay trở lại. Hôm nay là ${today}`;
      case "students":
        return "Xem danh sách, thêm, sửa thông tin học lực và quản lý hồ sơ sinh viên.";
      case "classes":
        return "Quản lý danh sách lớp học, phân khoa và thống kê điểm học tập.";
      default:
        return today;
    }
  };

  return (
    <header className="header">
      <div className="welcome-section">
        <h1>{getTitle()}</h1>
        <p>{getSubtitle()}</p>
      </div>

      <div className="header-actions">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={
            theme === "light"
              ? "Chuyển sang chế độ tối"
              : "Chuyển sang chế độ sáng"
          }
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="admin-profile">
          <img src={avt} alt="Admin" className="admin-avatar" />
          <div className="admin-info">
            <span className="admin-name">Kim Hoàng</span>
            <span className="admin-role">Trưởng phòng Đào tạo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
