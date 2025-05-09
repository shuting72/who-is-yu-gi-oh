// pages/display.js
import { useEffect, useState } from "react";

const defaultRecords = [
  { name: "USB王", unit: "次", icon: "🔌" },
  { name: "跳高王", unit: "公分", icon: "🏃‍♂️" },
  { name: "擲筊王", unit: "次", icon: "🩴" },
  { name: "高音王", unit: "音", icon: "🎵" },
  { name: "海賊王", unit: "分", icon: "🏴‍☠️" },
  { name: "下腰王", unit: "公分", icon: "🧘‍♂️" },
  { name: "準時王", unit: "秒", icon: "⏰" },
  { name: "乾眼王", unit: "秒", icon: "👁️" },
  { name: "色盲王", unit: "題", icon: "🕶️" },
  { name: "錯王", unit: "題", icon: "❌" },
  { name: "蟹堡王", unit: "題", icon: "🍔" },
  { name: "神射王", unit: "個", icon: "🏹" },
  { name: "搧大王", unit: "個", icon: "🪭" },
  { name: "守門王", unit: "顆", icon: "🥅" },
  { name: "定格王", unit: "公分", icon: "🤖" },
  { name: "反應王", unit: "毫秒", icon: "⚡" },
];

const neonColors = [
  "#00ffff", "#ff00ff", "#00ff00", "#ffff00",
  "#ff7777", "#77ffff", "#ff66cc", "#66ffcc",
  "#ffaa00", "#0099ff", "#ff9999", "#99ff00",
  "#00ff99", "#ffcc00", "#99ccff", "#ff66ff"
];

export default function Display() {
  const [records, setRecords] = useState(defaultRecords.map(r => ({
    ...r,
    holder: "--",
    score: "--"
  })));

  const load = () => {
    const stored = localStorage.getItem("records");
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = defaultRecords.map((item, i) => ({
        ...item,
        holder: parsed[i]?.holder || "--",
        score: parsed[i]?.score || "--"
      }));
      setRecords(merged);
    }
  };

  useEffect(() => {
    load();
    const sync = setInterval(() => {
      const t = localStorage.getItem("broadcast");
      if (t) load();
    }, 1000);
    return () => clearInterval(sync);
  }, []);

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "32px", textAlign: "center", marginBottom: "20px" }}>成績總表（投影用）</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {records.map((item, i) => (
          <div
            key={i}
            style={{
              border: `3px solid ${neonColors[i]}`,
              boxShadow: `0 0 15px ${neonColors[i]}`,
              padding: "16px",
              borderRadius: "12px",
              textAlign: "center",
              aspectRatio: "1 / 1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon} {item.name}</div>
            <div style={{ fontSize: "18px" }}>成績：{item.score} {item.unit}</div>
            <div style={{ fontSize: "16px", marginTop: "6px" }}>👑 {item.holder}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
