import styles from "../styles/display.module.css";
import { useEffect, useState } from "react";

const stages = [
  "USB王","跳高王","擲筊王","高音王",
  "海賊王","下腰王","準時王","乾眼王",
  "色盲王","錯王","蟹堡王","神射王",
  "搧大王","守門王","定格王","反應王"
];
const icons = [
  "💾","🔔","🩴","🎵",
  "🏴‍☠️","📏","⏰","👁️",
  "🕶️","❌","🍔","🎯",
  "🪭","🥅","🤖","⚡"
];

export default function Display() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState({});
  useEffect(() => {
    const sv = localStorage.getItem("scoreboard");
    if (sv) setData(JSON.parse(sv));
  }, []);
  useEffect(() => {
    const iv = setInterval(() => {
      setPage((p) => (p + 1) % 9);
    }, page === 0 ? 15000 : 7000);
    return () => clearInterval(iv);
  }, [page]);

  if (page === 0) {
    return (
      <div className={styles.grid}>
        {stages.map((s, i) => {
          const top = data[s]?.[0] || { name: "--", score: "--" };
          return (
            <div key={s} className={styles.card}>
              <div className={styles.stageTitle}>{icons[i]} {s}</div>
              <div className={styles.score}>成績：{top.score}</div>
              <div className={styles.champion}>👑 {top.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const li = (page - 1) * 2;
  const ri = li + 1;
  const render = (idx) => {
    const key = stages[idx];
    const rec = data[key] || [];
    return (
      <div key={key} className={styles.block}>
        <div className={styles.stage}>{icons[idx]} {key}</div>
        {rec.slice(0,5).map((x,i) => (
          <div key={i} className={styles.entry}>
            {["🥇","🥈","🥉","4️⃣","5️⃣"][i]} {x.name} - {x.score}{stages[idx] === "守門王" ? "顆" : ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.carousel}>
      {render(li)}
      {ri < stages.length && render(ri)}
    </div>
  );
}
