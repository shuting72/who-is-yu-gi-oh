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
  const [records, setRecords] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("scoreboard");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      const initial = {};
      defaultRecords.forEach(d => {
        initial[d.name] = Array.from({ length: 5 }, () => ({
          name: "",
          score: "",
          team: "",
          unit: d.unit
        }));
      });
      setRecords(initial);
    }
  }, []);

  const update = (stage, index, field, value) => {
    const updated = { ...records };
    updated[stage][index][field] = value;
    setRecords(updated);
    localStorage.setItem("scoreboard", JSON.stringify(updated));
    localStorage.setItem("broadcast", Date.now());
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>控場介面</h2>
      {defaultRecords.map((record) => (
        <div key={record.name} style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>{record.name}</div>
          {records[record.name]?.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ width: "24px" }}>{["🥇","🥈","🥉","4️⃣","5️⃣"][i]}</span>
              <input
                value={item.name}
                onChange={(e) => update(record.name, i, "name", e.target.value)}
                placeholder="記錄保持人"
                style={{ padding: "4px", width: "150px", color: "black" }}
              />
              <input
                value={item.score}
                onChange={(e) => update(record.name, i, "score", e.target.value)}
                placeholder={`成績（${record.unit}）`}
                style={{ padding: "4px", width: "150px", color: "black" }}
              />
              <select
                value={item.team}
                onChange={(e) => update(record.name, i, "team", e.target.value)}
                style={{ padding: "4px", color: "black" }}
              >
                <option value="">未選擇小隊</option>
                {[...Array(10)].map((_, t) => (
                  <option key={t + 1} value={t + 1}>第 {t + 1} 小隊</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
