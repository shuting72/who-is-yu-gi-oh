import styles from '../styles/display.module.css';
import { useEffect, useState } from 'react';

const stages = [
  "USB王", "跳高王", "擲筊王", "高音王",
  "海賊王", "下腰王", "準時王", "乾眼王",
  "色盲王", "錯王", "蟹堡王", "神射王",
  "搧大王", "守門王", "定格王", "反應王"
];

const icons = [
  "💾", "🔔", "🩴", "🎵",
  "🏴‍☠️", "📏", "⏰", "👁️",
  "🕶️", "❌", "🍔", "🎯",
  "🪭", "🥅", "🤖", "⚡"
];

const Display = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState({});
  const [teams, setTeams] = useState({});

  useEffect(() => {
    const update = () => {
      const stored = localStorage.getItem("scoreboard");
      if (stored) setData(JSON.parse(stored));

      const storedTeams = localStorage.getItem("teamScores");
      if (storedTeams) setTeams(JSON.parse(storedTeams));
    };
    update();

    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % 9);
      update();
    }, pageIndex === 0 ? 15000 : 7000);
    return () => clearInterval(interval);
  }, [pageIndex]);

  const teamColors = [
    "#ff0000", "#ff8000", "#ffff00", "#00ff00", "#008000",
    "#00ccff", "#0000ff", "#8000ff", "#ff66cc", "#996633"
  ];

  if (pageIndex === 0) {
    return (
      <div className={styles.grid}>
        {stages.map((stage, index) => {
          const score = data[stage]?.[0] || { name: "--", score: "--", team: "" };
          const bg = score.team ? teamColors[parseInt(score.team) - 1] : "#ffffff";
          return (
            <div key={stage} className={styles.card} style={{ backgroundColor: bg }}>
              <div className={styles.stageTitle}>{icons[index]} {stage}</div>
              <div className={styles.score}>成績：{score.score}</div>
              <div className={styles.champion}>👑 {score.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  const leftIndex = (pageIndex - 1) * 2;
  const rightIndex = leftIndex + 1;

  const renderBlock = (index) => {
    const stage = stages[index];
    const records = data[stage] || [];
    return (
      <div key={stage} className={styles.block}>
        <div className={styles.stage}>{icons[index]} {stage}</div>
        {records.slice(0, 5).map((item, i) => (
          <div key={i} className={styles.entry}>
            {["🥇","🥈","🥉","4️⃣","5️⃣"][i]} {item.name} - {item.score}{stage.includes("秒") ? "毫秒" : stage.includes("公分") ? "公分" : stage.includes("顆") ? "顆" : "次"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.carousel}>
      {renderBlock(leftIndex)}
      {rightIndex < stages.length && renderBlock(rightIndex)}
    </div>
  );
};

export default Display;
