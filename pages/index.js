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

const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

export default function Control() {
  const [records, setRecords] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      const init = {};
      defaultStages.forEach(stage => {
        init[stage.name] = Array(5).fill().map(() => ({
          holder: "", score: "", team: ""
        }));
      });
      setRecords(init);
    }
  }, []);

  const update = (stage, index, field, value) => {
    const updated = { ...records };
    updated[stage][index][field] = value;
    setRecords(updated);
    localStorage.setItem("records", JSON.stringify(updated));
    localStorage.setItem("broadcast", Date.now()); // 強制同步
  };

  const calculateScores = () => {
    const teamPoints = Array(11).fill(0); // 0 號不用，1~10 隊
    Object.values(records).forEach(ranks => {
      ranks.forEach((entry, i) => {
        const teamNum = parseInt(entry.team);
        if (teamNum >= 1 && teamNum <= 10) {
          teamPoints[teamNum] += 5 - i;
        }
      });
    });
    return teamPoints.slice(1); // 去除第 0 項
  };

  const teamScores = calculateScores();

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ width: "70%" }}>
        <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>控場介面</h2>
        {defaultStages.map((stage) => (
          <div key={stage.name} style={{ marginBottom: "32px" }}>
            <h3>{stage.name}</h3>
            {records[stage.name]?.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ width: "30px" }}>{medals[i]}</div>
                <input
                  value={entry.holder}
                  onChange={(e) => update(stage.name, i, "holder", e.target.value)}
                  placeholder="記錄保持人"
                  style={{ padding: "6px", width: "150px" }}
                />
                <input
                  value={entry.score}
                  onChange={(e) => update(stage.name, i, "score", e.target.value)}
                  placeholder={`成績（${stage.unit}）`}
                  style={{ padding: "6px", width: "150px" }}
                />
                <select
                  value={entry.team}
                  onChange={(e) => update(stage.name, i, "team", e.target.value)}
                  style={{ padding: "6px" }}
                >
                  <option value="">未選擇小隊</option>
                  {[...Array(10)].map((_, t) => (
                    <option key={t + 1} value={t + 1}>第 {t + 1} 小隊</option>
                  ))}
                </select>
              </div>
            ))}
            <hr style={{ marginTop: "12px" }} />
          </div>
        ))}
      </div>

      {/* 總積分欄 */}
      <div style={{ width: "25%", marginTop: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>🏆 各隊總積分</h3>
        {teamScores.map((score, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            第 {i + 1} 小隊：{score} 分
          </div>
        ))}
      </div>
    </div>
  );
}
