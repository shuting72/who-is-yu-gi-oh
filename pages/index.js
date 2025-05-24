import { useEffect, useState } from "react";

const defaultStages = [
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
  const [teamScores, setTeamScores] = useState({});

  // 1. 取 localStorage 或初始化
  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(
        defaultStages.map((s) => ({
          ...s,
          ranks: Array(5).fill({ name: "", score: "", team: "" }),
        }))
      );
    }
  }, []);

  // 2. 每次 records 變動，重新算總表與積分
  useEffect(() => {
    const board = {};
    const points = {};

    records.forEach((s) => {
      board[s.name] = s.ranks.filter((r) => r.name && r.score);
      s.ranks.forEach((r, i) => {
        if (r.team && r.score) {
          points[r.team] = (points[r.team] || 0) + (5 - i);
        }
      });
    });

    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("scoreboard", JSON.stringify(board));
    localStorage.setItem("teamScores", JSON.stringify(points));
    localStorage.setItem("broadcast", Date.now());
    setTeamScores(points);
  }, [records]);

  const update = (si, ri, field, value) => {
    const copy = [...records];
    copy[si].ranks[ri] = { ...copy[si].ranks[ri], [field]: value };
    setRecords(copy);
  };

  // 切成左右兩欄各 8
  const left = records.slice(0, 8);
  const right = records.slice(8);

  return (
    <div style={{ background: "#111", color: "#fff", padding: 24, minHeight: "100vh" }}>
      <h2 style={{ color: "#fff", fontSize: 28, marginBottom: 16 }}>控場介面</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          marginBottom: 32,
        }}
      >
        {[left, right].map((col, colIdx) => (
          <div key={colIdx}>
            {col.map((stage, si) => (
              <div key={si} style={{ marginBottom: 24 }}>
                <h3 style={{ color: "#fff", marginBottom: 8 }}>{stage.name}</h3>
                {stage.ranks.map((r, ri) => (
                  <div key={ri} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 24 }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][ri]}</div>
                    <input
                      placeholder="記錄保持人"
                      value={r.name}
                      onChange={(e) => update(colIdx * 8 + si, ri, "name", e.target.value)}
                      style={{ flex: 1, padding: 6 }}
                    />
                    <input
                      placeholder={`成績（${stage.unit}）`}
                      value={r.score}
                      onChange={(e) => update(colIdx * 8 + si, ri, "score", e.target.value)}
                      style={{ width: 140, padding: 6 }}
                    />
                    <select
                      value={r.team}
                      onChange={(e) => update(colIdx * 8 + si, ri, "team", e.target.value)}
                      style={{ width: 120, padding: 6 }}
                    >
                      <option value="">未選擇小隊</option>
                      {[...Array(10)].map((_, t) => (
                        <option key={t + 1} value={t + 1}>
                          第 {t + 1} 小隊
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <hr style={{ borderColor: "#333", marginTop: 16 }} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ color: "#fff", fontSize: 20 }}>
        <h3>🏆 各隊總積分</h3>
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            第 {i + 1} 小隊：{teamScores[i + 1] || 0} 分
          </div>
        ))}
      </div>
    </div>
  );
}
