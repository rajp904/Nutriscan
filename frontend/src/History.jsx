import { useEffect, useState } from "react";
import axios from "axios";

function History({ userId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/ocr/history/${userId}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-white text-black rounded-xl p-5 shadow-lg">

      <h2 className="text-lg font-bold mb-4 text-center">
        📜 Scan History
      </h2>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">No history found</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item._id}
              className="p-3 rounded-lg border border-gray-200"
            >
              <p><span className="font-semibold">Calories:</span> {item.calories}</p>
              <p><span className="font-semibold">Protein:</span> {item.protein}</p>
              <p><span className="font-semibold">Fat:</span> {item.fat}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default History;