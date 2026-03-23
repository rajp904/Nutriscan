import React from "react";

const NutritionResults = ({ nutrition = {} }) => {
  return (
    <div className="w-full bg-white text-black rounded-xl p-5 shadow-lg">

      <h2 className="text-lg font-bold mb-4 text-center">
        🍎 Nutrition Analysis
      </h2>

      <ul className="space-y-2 text-sm">
        <li><span className="font-semibold">Calories:</span> {nutrition.calories}</li>
        <li><span className="font-semibold">Fat:</span> {nutrition.fat}</li>
        <li><span className="font-semibold">Protein:</span> {nutrition.protein}</li>
        <li><span className="font-semibold">Carbs:</span> {nutrition.carbs}</li>
        <li><span className="font-semibold">Sugar:</span> {nutrition.sugar}</li>
        <li><span className="font-semibold">Fiber:</span> {nutrition.fiber}</li>
        <li><span className="font-semibold">Sodium:</span> {nutrition.sodium}</li>
        <li><span className="font-semibold">Serving Size:</span> {nutrition.servingSize}</li>
        <li><span className="font-semibold">Calories to Burn:</span> {nutrition.caloriesToBurn}</li>
        <li><span className="font-semibold">Steps Needed:</span> {nutrition.stepsNeeded}</li>
      </ul>

    </div>
  );
};

export default NutritionResults;