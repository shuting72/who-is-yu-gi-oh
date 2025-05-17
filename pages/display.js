import { useEffect, useState } from "react";

const defaultRecords = [
  { name: "USB王", unit: "次", icon: "💾", ranking: [
    { name: "小明", score: "50次" },
    { name: "阿花", score: "48次" },
    { name: "小志", score: "46次" },
    { name: "阿土", score: "44次" },
    { name: "大寶", score: "42次" },
  ]},
  { name: "跳高王", unit: "公分", icon: "🔔", ranking: [] },
  { name: "擲筊王", unit: "次", icon: "🩴", ranking: [] },
  { name: "高音王", unit: "音", icon: "🎵", ranking: [] },
  { name: "海賊王", unit: "分", icon: "🏴‍☠️", ranking: [] },
  { name: "下腰王", unit: "公分", icon: "📏", ranking: [] },
  { name: "準時王", unit: "秒", icon: "⏰", ranking: [] },
  { name: "乾眼王", unit: "秒", icon: "👁️", ranking: [] },
  { name: "色盲王", unit: "題", icon: "🕶️", ranking: [] },
  { name: "錯王", unit: "題", icon: "❌", ranking: [] },
  { name: "蟹堡王", unit: "題", icon: "🍔", ranking: [] },
  { name: "神射王", unit: "個", icon: "🏹", ranking: [] },
  { name: "搧大王", unit: "個", icon: "🪭", ranking: [] },
  { name: "守門王", unit: "顆", icon: "🥅", ranking: [] },
  { name: "定格王", unit: "公分", icon: "🤖", ranking: [] },
  { name: "反應王", unit: "毫秒", icon: "⚡", ranking: [] },
];

const teamColors = {
  1: "#FF0000", 2: "#FFA500", 3: "#FFFF00", 4: "#00FF7F", 5: "#228B22",
  6: "#00BFFF", 7: "#0000CD", 8: "#800080", 9: "#FF69B4", 10: "#8B4513"
};

export default function Display() {
  const [records, setRecords] = useState(defaultRecords.map(r => ({
    ...r, score: "--", holder: "--", team: r.team || "", ranking: r.ranking || []
  })));
  const [page, setPage] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = defaultRecords.map((item, i) => ({
        ...item,
        holder: parsed[i]?.holder || "--",
        score: parsed[i]?.score || "--",
        team: parsed[i]?.team || "",
        ranking: parsed[i]?.ranking || []
      }));
      setRecords(merged);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev % 17) + 1);
    }, page === 1 ? 10000 : 5000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", overflow: "hidden" }}>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
      `}</style>

      {page === 1 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          height: "100%",
          width: "100%",
          gap: 0,
          backgroundColor: "#000"
        }}>
          {records.map((item, i) => {
            const bg = item.team ? (teamColors[item.team] || "#8B4513") : "#111";
            const shadow = "2px 2px 4px #000";
            return (
              <div key={i} style={{
                backgroundColor: bg,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #000",
                color: "#fff",
                textShadow: shadow,
                boxSizing: "border-box"
              }}>
                <div style={{ fontSize: "4.8vh", fontWeight: "bold", marginBottom: "1vh", whiteSpace: "nowrap" }}>
                  {item.icon} {item.name}
                </div>
                <div style={{ fontSize: "3.5vh", marginBottom: "1vh", whiteSpace: "nowrap" }}>
                  成績：{item.score} {item.unit}
                </div>
                <div style={{ fontSize: "3.5vh", whiteSpace: "nowrap" }}>
                  👑 {item.holder}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          height: "100%",
          width: "100%",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "6vh", marginBottom: "4vh", textShadow: "2px 2px 4px #000" }}>
            {records[page - 2].icon} {records[page - 2].name}
          </div>
          <ol style={{ fontSize: "4vh", listStyle: "none", padding: 0, margin: 0, textShadow: "2px 2px 4px #000" }}>
            {(records[page - 2].ranking || []).slice(0, 5).map((r, idx) => (
              <li key={idx} style={{ marginBottom: "2vh" }}>
                {["🥇", "🥈", "🥉", "⭐", "⭐"][idx]} {r.name} - {r.score}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
