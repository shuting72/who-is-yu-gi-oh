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
      setRecords(defaultRecords.map(d => ({ ...d, holder: "", score: "", team: "" })));
    }
  }, []);

  const update = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    localStorage.setItem("broadcast", Date.now());
  };

  const getScoreBoard = () => {
    const scores = Array(10).fill(0); // index 0 ~ 9 對應第 1~10 隊
    const group = {};

    records.forEach(r => {
      if (!r.holder || !r.score || !r.team) return;
      if (!group[r.name]) group[r.name] = [];
      group[r.name].push({ ...r });
    });

    for (const key in group) {
      const sorted = group[key].sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
      sorted.slice(0, 5).forEach((item, idx) => {
        const teamIdx = parseInt(item.team) - 1;
        if (teamIdx >= 0 && teamIdx < 10) {
          scores[teamIdx] += 5 - idx;
        }
      });
    }
    return scores;
  };

  const scores = getScoreBoard();

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px", color: "white" }}>控場介面</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        {records.map((r, i) => (
          <div key={i} style={{ width: "48%", display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px" }}>
            <div style={{ width: "100px", fontWeight: "bold" }}>{r.name}</div>
            <input
              value={r.holder}
              onChange={(e) => update(i, "holder", e.target.value)}
              placeholder="記錄保持人"
              style={{
                padding: "6px",
                width: "120px",
                color: r.holder ? "black" : "#aaa"
              }}
            />
            <input
              value={r.score}
              onChange={(e) => update(i, "score", e.target.value)}
              placeholder={`成績（${r.unit}）`}
              style={{
                padding: "6px",
                width: "120px",
                color: r.score ? "black" : "#aaa"
              }}
            />
            <select
              value={r.team}
              onChange={(e) => update(i, "team", e.target.value)}
              style={{
                padding: "6px",
                color: r.team ? "black" : "#aaa"
              }}
            >
              <option value="">未選擇小隊</option>
              {[...Array(10)].map((_, t) => (
                <option key={t + 1} value={t + 1}>第 {t + 1} 小隊</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* 總積分顯示 */}
      <div style={{ marginTop: "40px", borderTop: "1px solid #888", paddingTop: "20px" }}>
        <h3 style={{ fontSize: "24px", color: "white", marginBottom: "10px" }}>總積分</h3>
        <ul style={{ columns: 2, color: "#fff", fontSize: "18px" }}>
          {scores.map((score, i) => (
            <li key={i}>第 {i + 1} 小隊：{score} 分</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
