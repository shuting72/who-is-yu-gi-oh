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

const teamColors = [
  "#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#007f00",
  "#00ccff", "#0000ff", "#8000ff", "#ff66cc", "#a0522d"
];

const Display = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const stored = localStorage.getItem("scoreboard");
      if (stored) {
        setData(JSON.parse(stored));
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % 9);
    }, pageIndex === 0 ? 15000 : 7000);
    return () => clearInterval(interval);
  }, [pageIndex]);

  if (pageIndex === 0) {
    return (
      <div className={styles.grid}>
        {stages.map((stage, index) => {
          const record = data[stage]?.[0] || { name: "--", score: "--", team: "" };
          const teamIndex = parseInt(record.team) - 1;
          const bgColor = teamColors[teamIndex] || "white";
          return (
            <div key={stage} className={styles.card} style={{ backgroundColor: bgColor }}>
              <div className={styles.stageTitle}>{icons[index]} {stage}</div>
              <div className={styles.score}>成績：{record.score}</div>
              <div className={styles.champion}>👑 {record.name}</div>
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
            {["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]} {item.name} - {item.score}{item.unit || ""}
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
