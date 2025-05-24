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
  const [teamScores, setTeamScores] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      const initial = defaultRecords.map((r) => ({
        name: r.name,
        unit: r.unit,
        ranks: Array(5).fill({ name: "", score: "", team: "" }),
      }));
      setRecords(initial);
    }
  }, []);

  useEffect(() => {
    // 排序 + 儲存
    const scoreboard = {};
    const teamPoints = {};

    records.forEach((r) => {
      const validRanks = r.ranks.filter(x => x.name && x.score);
      scoreboard[r.name] = validRanks;

      validRanks.forEach((item, idx) => {
        const team = item.team;
        if (!team) return;
        teamPoints[team] = (teamPoints[team] || 0) + (5 - idx);
      });
    });

    localStorage.setItem("scoreboard", JSON.stringify(scoreboard));
    localStorage.setItem("teamScores", JSON.stringify(teamPoints));
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("broadcast", Date.now());
    setTeamScores(teamPoints);
  }, [records]);

  const update = (stageIndex, rankIndex, field, value) => {
    const updated = [...records];
    const target = { ...updated[stageIndex].ranks[rankIndex], [field]: value };
    updated[stageIndex].ranks[rankIndex] = target;
    setRecords(updated);
  };

  return (
    <div style={{ background: "#111", color: "#000", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>控場介面</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "650px" }}>
          {records.map((r, i) => (
            <div key={i} style={{ marginBottom: "32px" }}>
              <h3 style={{ color: "#fff", marginBottom: "8px" }}>{r.name}</h3>
              {r.ranks.map((rank, j) => (
                <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                  <div style={{ width: "24px" }}>{["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][j]}</div>
                  <input
                    value={rank.name}
                    onChange={(e) => update(i, j, "name", e.target.value)}
                    placeholder="記錄保持人"
                    style={{ padding: "6px", width: "150px" }}
                  />
                  <input
                    value={rank.score}
                    onChange={(e) => update(i, j, "score", e.target.value)}
                    placeholder={`成績（${r.unit}）`}
                    style={{ padding: "6px", width: "150px" }}
                  />
                  <select
                    value={rank.team}
                    onChange={(e) => update(i, j, "team", e.target.value)}
                    style={{ padding: "6px", width: "120px" }}
                  >
                    <option value="">未選擇小隊</option>
                    {[...Array(10)].map((_, t) => (
                      <option key={t + 1} value={t + 1}>第 {t + 1} 小隊</option>
                    ))}
                  </select>
                </div>
              ))}
              <hr style={{ marginTop: "16px", borderColor: "#333" }} />
            </div>
          ))}
        </div>
        <div style={{ width: "240px", marginLeft: "40px", color: "white" }}>
          <h3>🏆 各隊總積分</h3>
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              第 {i + 1} 小隊：{teamScores[i + 1] || 0} 分
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
