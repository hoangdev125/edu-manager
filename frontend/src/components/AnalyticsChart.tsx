import React, { useState } from "react";
import type { Student } from "../types/student";

interface AnalyticsChartProps {
  students: Student[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ students }) => {
  const [chartType, setChartType] = useState<"gpa" | "department">("gpa");

  // 1. Calculate GPA distribution
  const gpaCategories = [
    { label: "Xuất sắc (>=3.6)", count: 0, color: "#10b981" },
    { label: "Khá (3.2 - 3.59)", count: 0, color: "#6366f1" },
    { label: "Trung bình (2.5 - 3.19)", count: 0, color: "#f59e0b" },
    { label: "Yếu (< 2.5)", count: 0, color: "#ef4444" },
  ];

  students.forEach((s) => {
    if (s.gpa >= 3.6) gpaCategories[0].count++;
    else if (s.gpa >= 3.2) gpaCategories[1].count++;
    else if (s.gpa >= 2.5) gpaCategories[2].count++;
    else gpaCategories[3].count++;
  });

  // 2. Calculate Department distribution
  const deptDataMap: { [key: string]: number } = {};
  students.forEach((s) => {
    deptDataMap[s.department] = (deptDataMap[s.department] || 0) + 1;
  });

  const deptCategories = Object.keys(deptDataMap).map((key) => ({
    label: key,
    count: deptDataMap[key],
    color: "#6366f1",
  }));

  const activeCategories = chartType === "gpa" ? gpaCategories : deptCategories;
  const maxCount = Math.max(...activeCategories.map((c) => c.count), 1);

  return (
    <div className="p-6 rounded-2xl bg-card-bg backdrop-blur-[20px] border border-card-border shadow-md hover:bg-card-hover-bg transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap border-b border-border-color pb-4">
        <h3 className="text-lg font-bold text-text-primary font-title">Thống kê học tập</h3>
        <div className="flex gap-2">
          <button
            className={`h-8 px-4 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
              chartType === "gpa" 
                ? "bg-primary border-transparent text-white" 
                : "bg-bg-secondary border-border-color text-text-primary hover:bg-input-bg"
            }`}
            onClick={() => setChartType("gpa")}
          >
            GPA
          </button>
          <button
            className={`h-8 px-4 text-xs font-semibold rounded-lg border transition-all duration-200 cursor-pointer ${
              chartType === "department" 
                ? "bg-primary border-transparent text-white" 
                : "bg-bg-secondary border-border-color text-text-primary hover:bg-input-bg"
            }`}
            onClick={() => setChartType("department")}
          >
            Khoa
          </button>
        </div>
      </div>

      {/* Chart Plot Row */}
      <div className="flex gap-4 items-stretch h-[240px] pt-4">
        {/* Y Axis */}
        <div className="flex flex-col justify-between text-text-muted text-[10px] sm:text-xs font-semibold text-right w-12 pb-6 select-none">
          <span>{maxCount} SV</span>
          <span>{Math.round(maxCount / 2)} SV</span>
          <span>0 SV</span>
        </div>

        {/* Grid & Bars Container */}
        <div className="flex-1 border-b-2 border-l border-border-color relative flex justify-around items-end px-2 pb-6 h-full">
          
          {/* Background Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-6">
            <div className="border-b border-dashed border-border-color w-full h-0" />
            <div className="border-b border-dashed border-border-color w-full h-0" />
            <div className="w-full h-0" />
          </div>

          {/* Render Bars */}
          {activeCategories.map((cat, idx) => {
            const pct = (cat.count / maxCount) * 100;
            return (
              <div
                key={idx}
                className="group relative z-10 flex-1 flex flex-col items-center justify-end h-full"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 bg-bg-secondary border border-border-color text-text-primary text-[10px] font-bold px-2 py-1 rounded-md shadow-md transition-all duration-200 pointer-events-none whitespace-nowrap z-50">
                  {cat.label}: {cat.count} sinh viên ({Math.round((cat.count / (students.length || 1)) * 100)}%)
                </div>

                {/* Bar */}
                <div
                  className="rounded-t-md cursor-pointer transition-all duration-300 w-3/5 max-w-[45px] hover:brightness-110 shadow-sm"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: cat.color,
                  }}
                />

                {/* X Label */}
                <span
                  className="absolute -bottom-6 text-text-secondary font-semibold text-[9px] sm:text-[10px] text-center whitespace-nowrap truncate max-w-[65px]"
                  title={cat.label}
                >
                  {chartType === "department"
                    ? cat.label.substring(0, 8) + (cat.label.length > 8 ? ".." : "")
                    : cat.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
