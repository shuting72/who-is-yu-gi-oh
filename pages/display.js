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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">成績總表（投影用）</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {records.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border-2"
            style={{ borderColor: "#0ff", boxShadow: "0 0 12px #0ff" }}
          >
            <div className="text-3xl text-center mb-2">{iconMap[item.name]} {item.name}</div>
            <div className="text-xl text-center">
              成績：{item.score || "--"} {item.unit}
            </div>
            <div className="text-md text-center mt-1">
              👑 {item.holder || "記錄保持人：--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
