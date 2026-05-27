import React, { useState } from "react";
import type { Student } from "../types/student";

interface AnalyticsChartProps {
  students: Student[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ students }) => {
  const [chartType, setChartType] = useState<"gpa" | "department">("gpa");

  // 1. Calculate GPA distribution
  const gpaCategories = [
    { label: "Xuất sắc (>=3.6)", count: 0, color: "var(--secondary)" },
    { label: "Khá (3.2 - 3.59)", count: 0, color: "var(--primary)" },
    {
      label: "Trung bình (2.5 - 3.19)",
      count: 0,
      color: "var(--status-suspended-text)",
    },
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
    color: "var(--primary)",
  }));

  const activeCategories = chartType === "gpa" ? gpaCategories : deptCategories;
  const maxCount = Math.max(...activeCategories.map((c) => c.count), 1);

  return (
    <div
      className="glass-card"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="card-header"
        style={{
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <h3 className="card-title">Thống kê học tập</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className={`btn btn-secondary btn-icon`}
            style={{
              height: "32px",
              fontSize: "12px",
              padding: "0 12px",
              backgroundColor:
                chartType === "gpa" ? "var(--primary)" : "var(--bg-secondary)",
              color: chartType === "gpa" ? "white" : "var(--text-primary)",
              borderColor:
                chartType === "gpa" ? "transparent" : "var(--border-color)",
            }}
            onClick={() => setChartType("gpa")}
          >
            GPA
          </button>
          <button
            className={`btn btn-secondary btn-icon`}
            style={{
              height: "32px",
              fontSize: "12px",
              padding: "0 12px",
              backgroundColor:
                chartType === "department"
                  ? "var(--primary)"
                  : "var(--bg-secondary)",
              color:
                chartType === "department" ? "white" : "var(--text-primary)",
              borderColor:
                chartType === "department"
                  ? "transparent"
                  : "var(--border-color)",
            }}
            onClick={() => setChartType("department")}
          >
            Khoa
          </button>
        </div>
      </div>

      {/* Bao bọc toàn bộ khu vực biểu đồ bao gồm cả trục Y */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "16px",
          minHeight: "260px",
          paddingBottom: "20px",
          position: "relative",
        }}
      >
        {/* Trục Y: Đứng độc lập bên trái, phân bố đều theo chiều dọc */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "var(--text-muted)",
            fontSize: "12px",
            fontWeight: 500,
            textAlign: "right",
            width: "50px",
            paddingBottom: "30px" /* Chừa khoảng trống ngang hàng với nhãn X */,
          }}
        >
          <span>{maxCount} SV</span>
          <span>{Math.round(maxCount / 2)} SV</span>
          <span>0 SV</span>
        </div>

        {/* Khung chứa các cột đồ thị và đường Gridlines ẩn */}
        <div
          className="chart-container"
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            justifyContent: "space-around",
            alignItems:
              "flex-end" /* Ép các cột xuất phát dựng đứng từ đáy lên */,
            height: "calc(100% - 30px)" /* Trừ hao phần nhãn chữ bên dưới */,
            borderBottom: "2px solid var(--border-color)",
            padding: "0 10px",
          }}
        >
          {/* Đường kẻ ngang background (Grid lines) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <div
              style={{
                borderBottom: "1px dashed var(--border-color)",
                width: "100%",
                height: 0,
              }}
            />
            <div
              style={{
                borderBottom: "1px dashed var(--border-color)",
                width: "100%",
                height: 0,
              }}
            />
            <div style={{ width: "100%", height: 0 }} />
          </div>

          {/* Vòng lặp vẽ các Cột đồ thị */}
          {activeCategories.map((cat, idx) => {
            const pct = (cat.count / maxCount) * 100;
            return (
              <div
                key={idx}
                className="chart-bar-group"
                style={{
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                  position: "relative",
                  flex: 1,
                }}
              >
                {/* Thanh cột màu của đồ thị */}
                <div
                  className="chart-bar"
                  style={{
                    height: `${pct}%`,
                    width: "70%" /* Đảm bảo cột có bề ngang cố định rõ ràng */,
                    maxWidth: "45px",
                    borderRadius: "6px 6px 0 0",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    background: cat.color.includes("var(")
                      ? cat.color
                      : undefined,
                    backgroundColor: !cat.color.includes("var(")
                      ? cat.color
                      : undefined,
                  }}
                >
                  {/* Tooltip khi hover chuột vào cột */}
                  <div className="chart-tooltip">
                    {cat.label}: {cat.count} sinh viên (
                    {Math.round((cat.count / (students.length || 1)) * 100)}%)
                  </div>
                </div>

                {/* Nhãn text bên dưới mỗi chân cột */}
                <span
                  className="chart-label"
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    fontSize: chartType === "department" ? "10px" : "11px",
                    whiteSpace: "nowrap",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {chartType === "department"
                    ? cat.label.substring(0, 12) +
                      (cat.label.length > 12 ? ".." : "")
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
