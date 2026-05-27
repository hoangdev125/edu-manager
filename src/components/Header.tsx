import React from "react";
import { useStudents } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon } from "lucide-react";
import avt from "../assets/avt.jpg";

export const Header: React.FC = () => {
  const { activeTab, theme, toggleTheme, getStudentById } = useStudents();
  const { currentUser } = useAuth();

  const student = currentUser?.studentId ? getStudentById(currentUser.studentId) : undefined;

  const getTitle = () => {
    if (currentUser?.role === 'student') {
      return "Hồ sơ học vụ cá nhân";
    }

    switch (activeTab) {
      case "dashboard":
        return "Bảng điều khiển";
      case "students":
        return "Quản lý sinh viên";
      case "classes":
        return "Quản lý lớp học";
      default:
        return "Edu Manager";
    }
  };

  const getSubtitle = () => {
    const today = new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (currentUser?.role === 'student') {
      return `Chào mừng bạn trở lại, sinh viên ${currentUser.fullName}. Hôm nay là ${today}`;
    }

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

  const getUserAvatar = () => {
    if (currentUser?.role === 'student' && student?.avatar) {
      return student.avatar;
    }
    return avt; // default admin avatar
  };

  return (
    <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 mb-6 border-b border-border-color">
      <div className="welcome-section">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-title mb-1">
          {getTitle()}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">{getSubtitle()}</p>
      </div>

      <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
        <button
          onClick={toggleTheme}
          className="w-11 h-11 rounded-xl border border-border-color bg-bg-secondary text-text-primary flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-input-bg hover:border-text-muted"
          title={
            theme === "light"
              ? "Chuyển sang chế độ tối"
              : "Chuyển sang chế độ sáng"
          }
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-bg-secondary border border-border-color shadow-sm">
          <img
            src={getUserAvatar()}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-primary bg-input-bg"
          />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-text-primary leading-tight font-title">
              {currentUser?.fullName}
            </span>
            <span className="text-[10px] text-text-muted font-medium mt-0.5">
              {currentUser?.role === 'admin' ? 'Trưởng phòng Đào tạo' : `Sinh viên (${student?.id})`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
