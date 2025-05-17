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
    const totalPages = 9; // 1 總覽 + 8 排行榜
    const interval = setInterval(() => {
      setPage((prev) => (prev % totalPages) + 1);
    }, page === 1 ? 15000 : 7000); // 15 秒總覽，7 秒排行榜
    return () => clearInterval(interval);
  }, [page]);

  const getMedal = (index) => {
    return ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][index] || "";
  };

  return (
    <div style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#000" }}>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
          background-color: #000;
        }
      `}</style>

      {page === 1 ? (
        // 總覽畫面
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          height: "100%",
          width: "100%",
          gap: 0
        }}>
          {records.map((item, i) => (
            <div key={i} style={{
              backgroundColor: "#111",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid #000",
              color: "#fff",
              textShadow: "2px 2px 4px #000",
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
          ))}
        </div>
      ) : (
        // 排行榜畫面
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: "100%",
          padding: "2vh",
          backgroundColor: "#000",
          color: "#fff"
        }}>
          {[0, 1].map((offset) => {
            const idx = (page - 2) * 2 + offset;
            const item = records[idx];
            if (!item) return null;

            return (
              <div key={idx} style={{
                flex: "0 0 45%",
                backgroundColor: "#1a1a1a",
                border: "3px solid white",
                borderRadius: "10px",
                padding: "2vh",
                boxShadow: "0 0 20px white",
                textAlign: "center"
              }}>
                <div style={{
                  fontSize: "5vh",
                  fontWeight: "bold",
                  marginBottom: "2vh",
                  textShadow: "0 0 10px white"
                }}>
                  {item.icon} {item.name}
                </div>
                <ol style={{ listStyle: "none", padding: 0, fontSize: "3.5vh", textShadow: "0 0 8px white" }}>
                  {(item.ranking || []).slice(0, 5).map((r, i) => (
                    <li key={i} style={{ marginBottom: "1.5vh" }}>
                      {getMedal(i)} {r.name} - {r.score}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
