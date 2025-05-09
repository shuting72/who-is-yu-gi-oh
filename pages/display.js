// pages/display.js
import { useEffect, useState } from "react";

const defaultRecords = [
  { name: "USB王", unit: "次", icon: "🔌" },
  { name: "跳高王", unit: "公分", icon: "🪢" },
  { name: "擲筊王", unit: "次", icon: "🩴" },
  { name: "高音王", unit: "音", icon: "🎵" },
  { name: "海賊王", unit: "分", icon: "🏴‍☠️" },
  { name: "下腰王", unit: "公分", icon: "🏁" },
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

const teamColors = {
  1: "#ff4c4c", // 紅
  2: "#ffa500", // 橘
  3: "#ffde59", // 黃
  4: "#4cff4c", // 綠
  5: "#4cd3ff", // 淺藍
  6: "#4c6cff", // 藍
  7: "#b84cff", // 紫
  8: "#ff4cf2", // 粉紅
  9: "#888",     // 灰
  10: "#a0522d" // 棕
};

export default function Display() {
  const [records, setRecords] = useState(defaultRecords.map(item => ({
    ...item,
    holder: "--",
    score: "--",
    team: "1"
  })));

  const load = () => {
    const stored = localStorage.getItem("records");
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = defaultRecords.map((item, i) => ({
        ...item,
        holder: parsed[i]?.holder || "--",
        score: parsed[i]?.score || "--",
        team: parsed[i]?.team || "1"
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
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        maxWidth: "1600px",
        margin: "0 auto"
      }}>
        {records.map((item, i) => (
          <div
            key={i}
            style={{
              border: `4px solid ${teamColors[item.team]}`,
              boxShadow: `0 0 20px ${teamColors[item.team]}`,
              padding: "12px",
              borderRadius: "12px",
              textAlign: "center",
              aspectRatio: "1 / 1",
              fontSize: "2.4vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div>{item.icon} {item.name}</div>
            <div style={{ marginTop: "10px" }}>成績：{item.score} {item.unit}</div>
            <div style={{ marginTop: "6px" }}>👑 {item.holder}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
