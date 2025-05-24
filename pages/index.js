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
  const [teamScores, setTeamScores] = useState(Array(10).fill(0));

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      setRecords(
        defaultRecords.map((d) => ({
          ...d,
          holders: Array(5).fill({ name: "", score: "", team: "" }),
        }))
      );
    }
  }, []);

  useEffect(() => {
    const scores = Array(10).fill(0);
    records.forEach((rec) => {
      rec.holders?.forEach((h, i) => {
        if (h.team) {
          scores[parseInt(h.team) - 1] += 5 - i;
        }
      });
    });
    setTeamScores(scores);
  }, [records]);

  const update = (stageIndex, rankIndex, field, value) => {
    const updated = [...records];
    updated[stageIndex].holders[rankIndex] = {
      ...updated[stageIndex].holders[rankIndex],
      [field]: value,
    };
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    localStorage.setItem("broadcast", Date.now());
  };

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>控場介面</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
        {records.map((rec, i) => (
          <div key={i} style={{ width: "48%", borderBottom: "1px solid #555", paddingBottom: "12px" }}>
            <div style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "8px" }}>{rec.name}</div>
            {rec.holders.map((h, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <span style={{ width: "30px" }}>{["🥇","🥈","🥉","4️⃣","5️⃣"][j]}</span>
                <input
                  placeholder="記錄保持人"
                  value={h.name}
                  onChange={(e) => update(i, j, "name", e.target.value)}
                  style={{ padding: "6px", width: "120px" }}
                />
                <input
                  placeholder={`成績（${rec.unit}）`}
                  value={h.score}
                  onChange={(e) => update(i, j, "score", e.target.value)}
                  style={{ padding: "6px", width: "120px" }}
                />
                <select
                  value={h.team}
                  onChange={(e) => update(i, j, "team", e.target.value)}
                  style={{ padding: "6px" }}
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

      <h3 style={{ marginTop: "30px", fontSize: "22px" }}>🏆 各隊總積分</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {teamScores.map((score, i) => (
          <li key={i} style={{ marginBottom: "6px" }}>
            第 {i + 1} 小隊：{score} 分
          </li>
        ))}
      </ul>
    </div>
  );
}
