import { useState, useEffect } from "react";

const challenges = [
  { id: 1, name: "USB王", unit: "次" },
  { id: 2, name: "跳高王", unit: "公分" },
  { id: 3, name: "擲筊王", unit: "次" },
  { id: 4, name: "高音王", unit: "音" },
  { id: 5, name: "海賊王", unit: "分" },
  { id: 6, name: "下腰王", unit: "公分" },
  { id: 7, name: "準時王", unit: "秒" },
  { id: 8, name: "乾眼王", unit: "秒" },
  { id: 9, name: "色盲王", unit: "題" },
  { id: 10, name: "錯王", unit: "題" },
  { id: 11, name: "蟹堡王", unit: "題" },
  { id: 12, name: "神射王", unit: "個" },
  { id: 13, name: "搧大王", unit: "個" },
  { id: 14, name: "守門王", unit: "顆" },
  { id: 15, name: "定格王", unit: "公分" },
  { id: 16, name: "反應王", unit: "毫秒" },
];

export default function Scoreboard() {
  const [records, setRecords] = useState({});
  const [selected, setSelected] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [scoreInput, setScoreInput] = useState("");

  // sync via localStorage for multi-tab
  useEffect(() => {
    const stored = localStorage.getItem("records");
    if (stored) setRecords(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
    window.dispatchEvent(new Event("storage"));
  }, [records]);

  useEffect(() => {
    const handler = () => {
      const latest = localStorage.getItem("records");
      if (latest) setRecords(JSON.parse(latest));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleSave = () => {
    setRecords({
      ...records,
      [selected.id]: { name: nameInput, score: scoreInput },
    });
    setSelected(null);
    setNameInput("");
    setScoreInput("");
  };

  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const isDisplay = path === "/display";

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl text-center mb-6 font-bold text-white">競賽成績榜</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {challenges.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              if (isDisplay) return;
              setSelected(c);
              setNameInput(records[c.id]?.name || "");
              setScoreInput(records[c.id]?.score || "");
            }}
            className={`rounded-2xl p-4 border-2 shadow-xl transition-transform cursor-pointer text-center 
              ${isDisplay ? "bg-gray-900 border-green-400" : "bg-black border-pink-500 hover:scale-105"}`}
          >
            <div className="text-xl font-bold text-green-400">{c.name}</div>
            <div className="mt-2 text-2xl font-bold">
              {records[c.id]?.score ? `${records[c.id].score} ${c.unit}` : "--"}
            </div>
            <div className="text-sm text-gray-300">
              {records[c.id]?.name || "記錄保持人：--"}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && !isDisplay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-md border border-pink-500">
            <h2 className="text-xl mb-4 text-pink-400 font-bold">{selected.name}</h2>
            <label className="block mb-2">記錄保持人：</label>
            <input
              className="w-full p-2 rounded bg-black border border-pink-400 text-white mb-4"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="輸入名字"
            />
            <label className="block mb-2">成績（單位：{selected.unit}）：</label>
            <input
              className="w-full p-2 rounded bg-black border border-pink-400 text-white mb-4"
              value={scoreInput}
              onChange={(e) => setScoreInput(e.target.value)}
              placeholder="輸入數值"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                onClick={() => setSelected(null)}
              >
                取消
              </button>
              <button
                className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600"
                onClick={handleSave}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
