import React, { useState, useEffect } from "react";
import CameraCapture from "./components/CameraCapture";
import NutritionResults from "./components/NutritionResults";
import Login from "./Login";
import Signup from "./Signup";
import History from "./History";

function App() {
  const [userId, setUserId] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const handleNutritionUpdate = (data) => {
    setNutrition(data);
  };

  // 🔐 Auth
  if (!userId) {
    return showLogin ? (
      <Login setUserId={setUserId} setShowLogin={setShowLogin} />
    ) : (
      <Signup setShowLogin={setShowLogin} />
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 py-6 flex flex-col items-center">

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Nutriscan 🔲🍎
      </h1>

      {/* TOP BUTTONS */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("userId");
            setUserId(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {/* CAMERA SECTION */}
      <div className="w-full max-w-md bg-zinc-900 p-4 rounded-xl shadow-md">
        <p className="text-center text-gray-300 mb-2">
          Nutrition Label Scanner
        </p>

        <CameraCapture
          userId={userId}
          onNutritionUpdate={handleNutritionUpdate}
        />
      </div>

      {/* RESULT */}
      {nutrition && (
        <div className="w-full max-w-md mt-6">
          <NutritionResults nutrition={nutrition} />
        </div>
      )}

      {/* HISTORY */}
      {showHistory && (
        <div className="w-full max-w-md mt-6">
          <History userId={userId} />
        </div>
      )}
    </div>
  );
}

export default App;