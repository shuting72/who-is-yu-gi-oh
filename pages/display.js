// pages/display.js
import { useEffect, useState } from "react";

const iconMap = {
  "USB王": "🔌",
  "跳高王": "🏃‍♂️",
  "擲筊王": "🩴",
  "高音王": "🎵",
  "海賊王": "🏴‍☠️",
  "下腰王": "🧘‍♂️",
  "準時王": "⏰",
  "乾眼王": "👁️",
  "色盲王": "🕶️",
  "錯王": "❌",
  "蟹堡王": "🍔",
  "神射王": "🏹",
  "搧大王": "🪭",
  "守門王": "🥅",
  "定格王": "🤖",
  "反應王": "⚡",
};

const neonColors = [
  "#0ff", "#f0f", "#0f0", "#ff0", "#f77", "#7ff", "#f0c", "#0fc",
  "#fa0", "#0af", "#f99", "#9f0", "#0f9", "#fc0", "#9cf", "#f6f"
];

export default function Display() {
  const [records, setRecords] = useState([]);

  const load = () => {
    const stored = localStorage.getItem("records");
    if (stored) setRecords(JSON.parse(stored));
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
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">成績總表（投影用）</h1>
      <div className="grid grid-cols-4 gap-4 max-w-screen-xl mx-auto">
        {records.map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-4 flex flex-col items-center justify-center text-center"
            style={{
              border: `3px solid ${neonColors[i % neonColors.length]}`,
              boxShadow: `0 0 15px ${neonColors[i % neonColors.length]}`,
              minHeight: "120px"
            }}
          >
            <div className="text-3xl mb-1">{iconMap[item.name]} {item.name}</div>
            <div className="text-xl">成績：{item.score || "--"} {item.unit}</div>
            <div className="text-md mt-1">👑 {item.holder || "--"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
