// pages/index.js
import { useState, useEffect } from "react";

const initialData = [
  { name: "USB王", unit: "次" },
  { name: "跳高王", unit: "公分" },
  { name: "擲筊王", unit: "次" },
  { name: "高音王", unit: "音" },
  { name: "海賊王", unit: "分" },
  { name: "下腰王", unit: "公分" },
  { name: "準時王", unit: "秒" },
  { name: "乾眼王", unit: "秒" },
  { name: "色盲王", unit: "題" },
  { name: "錯王", unit: "題" },
  { name: "蟹堡王", unit: "題" },
  { name: "神射王", unit: "個" },
  { name: "搧大王", unit: "個" },
  { name: "守門王", unit: "顆" },
  { name: "定格王", unit: "公分" },
  { name: "反應王", unit: "毫秒" },
];

export default function ControlPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      setRecords(initialData.map((d) => ({ ...d, holder: "", score: "" })));
    }
  }, []);

  const update = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    // sync to display
    window.localStorage.setItem("broadcast", Date.now());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">控場介面</h1>
      <div className="space-y-4">
        {records.map((item, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-700 pb-2">
            <div className="w-32 font-semibold text-lg">{item.name}</div>
            <input
              placeholder="記錄保持人"
              value={item.holder}
              onChange={(e) => update(i, "holder", e.target.value)}
              className="px-2 py-1 bg-gray-800 rounded w-40"
            />
            <input
              placeholder={`成績（${item.unit}）`}
              value={item.score}
              onChange={(e) => update(i, "score", e.target.value)}
              className="px-2 py-1 bg-gray-800 rounded w-32"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
