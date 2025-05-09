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
  1: "#ff4c4c",  2: "#ffa500",  3: "#ffde59",  4: "#4cff4c",  5: "#4cd3ff",
  6: "#4c6cff",  7: "#b84cff",  8: "#ff4cf2",  9: "#888",     10: "#a0522d"
};

export default function Display() {
  const [records, setRecords] = useState(defaultRecords.map(r => ({
    ...r, score: "--", holder: "--", team: ""
  })));

  const load = () => {
    const stored = localStorage.getItem("records");
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = defaultRecords.map((item, i) => ({
        ...item,
        holder: parsed[i]?.holder || "--",
        score: parsed[i]?.score || "--",
        team: parsed[i]?.team || ""
      }));
      setRecords(merged);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(() => {
      if (localStorage.getItem("broadcast")) load();
    }, 1000);
    return () => clearInterval(interval);
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
        {records.map((item, i) => {
          const color = teamColors[item.team] || "#fff";
          return (
            <div
              key={i}
              style={{
                border: `4px solid ${color}`,
                boxShadow: `0 0 20px ${color}`,
                padding: "12px",
                borderRadius: "12px",
                textAlign: "center",
                aspectRatio: "1 / 1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: "1.2vw"
              }}
            >
              <div style={{ fontSize: "2.5vw", marginBottom: "8px" }}>{item.icon} {item.name}</div>
              <div
                style={{
                  fontSize: "1.6vw",
                  marginBottom: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                成績：{item.score} {item.unit}
              </div>
              <div style={{ fontSize: "1.2vw" }}>👑 {item.holder}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
