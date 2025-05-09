// pages/index.js
import { useEffect, useState } from "react";

const defaultRecords = [
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

export default function Control() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      setRecords(defaultRecords.map(d => ({ ...d, holder: "", score: "", team: "1" })));
    }
  }, []);

  const update = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    localStorage.setItem("broadcast", Date.now());
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>控場介面</h2>
      {records.map((r, i) => (
        <div key={i} style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "100px", fontWeight: "bold" }}>{r.name}</div>
          <input
            value={r.holder}
            onChange={(e) => update(i, "holder", e.target.value)}
            placeholder="記錄保持人"
            style={{ padding: "6px", width: "150px" }}
          />
          <input
            value={r.score}
            onChange={(e) => update(i, "score", e.target.value)}
            placeholder={`成績（${r.unit}）`}
            style={{ padding: "6px", width: "150px" }}
          />
          <select
            value={r.team}
            onChange={(e) => update(i, "team", e.target.value)}
            style={{ padding: "6px" }}
          >
            {[...Array(10)].map((_, t) => (
              <option key={t + 1} value={t + 1}>第 {t + 1} 小隊</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
