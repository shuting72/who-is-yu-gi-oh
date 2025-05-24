import { useEffect, useState } from "react";
import styles from "../styles/display.module.css";

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
const teamColors = {
  1:"red",2:"orange",3:"yellow",4:"#7CFC00",
  5:"green",6:"#00BFFF",7:"blue",8:"purple",
  9:"pink",10:"brown"
};

export default function Display() {
  const [page, setPage] = useState(0);
  const [board, setBoard] = useState({});

  // 載入 & 監聽 control 廣播
  useEffect(() => {
    const load = () => {
      const rec = JSON.parse(localStorage.getItem("records")||"[]");
      const b = {};
      rec.forEach(s => {
        b[s.name] = s.ranks.filter(r=>r.name&&r.score);
      });
      setBoard(b);
    };
    load();
    window.addEventListener("storage", load);
    return ()=>window.removeEventListener("storage", load);
  }, []);

  // 頁面輪播
  useEffect(() => {
    const iv = setInterval(() => {
      setPage(p=> (p+1)%9);
    }, page===0?15000:7000);
    return ()=>clearInterval(iv);
  }, [page]);

  // 總表
  if (page===0) {
    return (
      <div className={styles.grid}>
        {stages.map((s,i)=>{
          const top = board[s]?.[0]||{};
          const bg = teamColors[top.team]||"#fff";
          return (
            <div key={s}
              className={styles.card}
              style={{ background:bg }}
            >
              <div className={styles.stageTitle}>{icons[i]} {s}</div>
              <div className={styles.score}>成績：{top.score||"--"}</div>
              <div className={styles.champion}>👑 {top.name||"--"}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // 輪播
  const li = (page-1)*2, ri=li+1;
  const Render = idx => {
    const s = stages[idx];
    const arr = board[s]||[];
    return (
      <div key={s} className={styles.block}>
        <div className={styles.stage}>{icons[idx]} {s}</div>
        {arr.slice(0,5).map((r,i)=>(
          <div key={i} className={styles.entry}>
            {["🥇","🥈","🥉","4️⃣","5️⃣"][i]} {r.name} - {r.score}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className={styles.carousel}>
      {Render(li)}
      {ri<stages.length && Render(ri)}
    </div>
  );
}
