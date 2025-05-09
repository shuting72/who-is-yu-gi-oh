import { useEffect, useState } from "react";

const challenges = [
  { id: 1, name: "USB王", unit: "次", icon: "🖴" },
  { id: 2, name: "跳高王", unit: "公分", icon: "🏃‍♂️" },
  { id: 3, name: "擲筊王", unit: "次", icon: "👟" },
  { id: 4, name: "高音王", unit: "音", icon: "🎵" },
  { id: 5, name: "海賊王", unit: "分", icon: "🏴‍☠️" },
  { id: 6, name: "下腰王", unit: "公分", icon: "🤸" },
  { id: 7, name: "準時王", unit: "秒", icon: "⏰" },
  { id: 8, name: "乾眼王", unit: "秒", icon: "👁️‍🗨️" },
  { id: 9, name: "色盲王", unit: "題", icon: "🕶️" },
  { id: 10, name: "錯王", unit: "題", icon: "❌" },
  { id: 11, name: "蟹堡王", unit: "題", icon: "🍔" },
  { id: 12, name: "神射王", unit: "個", icon: "🏹" },
  { id: 13, name: "搧大王", unit: "個", icon: "🪭" },
  { id: 14, name: "守門王", unit: "顆", icon: "🥅" },
  { id: 15, name: "定格王", unit: "公分", icon: "🤖" },
  { id: 16, name: "反應王", unit: "毫秒", icon: "⚡" },
];

export default function Display() {
  const [records, setRecords] = useState({});

  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem("records");
      if (stored) setRecords(JSON.parse(stored));
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl text-center font-bold mb-6 text-white">
        成績總表（投影用）
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border-2 border-green-400 bg-gray-900 p-4 text-center shadow-md"
          >
            <div className="text-3xl mb-2 text-green-300">{c.icon}</div>
            <div className="text-xl font-bold text-green-400">{c.name}</div>
            <div className="mt-2 text-2xl">
              {records[c.id]?.score ? `${records[c.id].score} ${c.unit}` : "--"}
            </div>
            <div className="text-sm text-gray-300">
              {records[c.id]?.name || "記錄保持人：--"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
