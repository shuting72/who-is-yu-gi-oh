import { useState } from "react";

const initialLevels = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: "",
  score: "",
  unit: "",
}));

export default function Scoreboard() {
  const [levels, setLevels] = useState(initialLevels);

  const handleChange = (id, field, value) => {
    setLevels((prev) =>
      prev.map((lv) =>
        lv.id === id ? { ...lv, [field]: value } : lv
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">16 關競賽成績統計</h1>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">關卡</th>
            <th className="border px-2 py-1">負責人</th>
            <th className="border px-2 py-1">成績</th>
            <th className="border px-2 py-1">單位</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lv) => (
            <tr key={lv.id}>
              <td className="border px-2 py-1 text-center">第 {lv.id} 關</td>
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded px-1 py-0.5"
                  value={lv.name}
                  onChange={(e) => handleChange(lv.id, "name", e.target.value)}
                  placeholder="輸入姓名"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded px-1 py-0.5"
                  value={lv.score}
                  onChange={(e) => handleChange(lv.id, "score", e.target.value)}
                  placeholder="輸入成績"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  className="w-full border rounded px-1 py-0.5"
                  value={lv.unit}
                  onChange={(e) => handleChange(lv.id, "unit", e.target.value)}
                  placeholder="輸入單位"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            console.log("所有關卡資料：", levels);
            alert("請在 Console（F12） 裡查看資料結構");
          }}
        >
          存檔／送出
        </button>
      </div>
    </div>
  );
}
