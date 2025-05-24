import { useEffect, useState } from "react";

const defaultStages = [
  "USB王","跳高王","擲筊王","高音王",
  "海賊王","下腰王","準時王","乾眼王",
  "色盲王","錯王","蟹堡王","神射王",
  "搧大王","守門王","定格王","反應王"
];
const medals = ["🥇","🥈","🥉","4️⃣","5️⃣"];

export default function Control() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("records");
    if (saved) {
      setRecords(JSON.parse(saved));
    } else {
      setRecords(defaultStages.map((name) => ({
        name,
        unit: {
          "USB王":"次","跳高王":"公分","擲筊王":"次","高音王":"音",
          "海賊王":"分","下腰王":"公分","準時王":"秒","乾眼王":"秒",
          "色盲王":"題","錯王":"題","蟹堡王":"題","神射王":"個",
          "搧大王":"個","守門王":"顆","定格王":"公分","反應王":"毫秒"
        }[name],
        ranks: Array(5).fill({ name:"", score:"", team:"" })
      })));
    }
  }, []);

  // 儲存 & 廣播
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
    // 觸發 storage event
    localStorage.setItem("broadcast", Date.now().toString());
  }, [records]);

  const update = (si, ri, field, value) => {
    const cp = [...records];
    cp[si] = {
      ...cp[si],
      ranks: cp[si].ranks.map((r, i) =>
        i === ri ? { ...r, [field]: value } : r
      )
    };
    setRecords(cp);
  };

  // 分 2 列，各 8 項
  const left = records.slice(0, 8), right = records.slice(8);

  return (
    <div style={{ background:"#111", color:"#fff", minHeight:"100vh", padding:24 }}>
      <h2 style={{ color:"#fff" }}>控場介面</h2>
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:48,
        marginBottom:32
      }}>
        {[left, right].map((col, ci) => (
          <div key={ci}>
            {col.map((s, si) => (
              <div key={si} style={{ marginBottom:24 }}>
                <h3 style={{ color:"#fff" }}>{s.name}</h3>
                {s.ranks.map((r, ri) => (
                  <div key={ri} style={{ display:"flex", gap:8, marginBottom:6 }}>
                    <div style={{ width:24 }}>{medals[ri]}</div>
                    <input
                      placeholder="記錄保持人"
                      value={r.name}
                      onChange={e => update(ci*8+si, ri, "name", e.target.value)}
                      style={{ flex:1, padding:6, color:"#000" }}
                    />
                    <input
                      placeholder={`成績（${s.unit}）`}
                      value={r.score}
                      onChange={e => update(ci*8+si, ri, "score", e.target.value)}
                      style={{ width:140, padding:6, color:"#000" }}
                    />
                    <select
                      value={r.team}
                      onChange={e => update(ci*8+si, ri, "team", e.target.value)}
                      style={{ width:120, padding:6, color:"#000" }}
                    >
                      <option value="">未選擇小隊</option>
                      {[...Array(10)].map((_, t) => (
                        <option key={t+1} value={t+1}>第 {t+1} 小隊</option>
                      ))}
                    </select>
                  </div>
                ))}
                <hr style={{ borderColor:"#333", marginTop:16 }}/>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
