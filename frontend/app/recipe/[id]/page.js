"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chatbot from "@/app/components/Chatbot";

const parseJSONList = (value) => {
    try {
      if (typeof value === "string" && value.startsWith('"') && value.endsWith('"')) {
        value = JSON.parse(value); //remove first level of quotes
      }
  
      if (typeof value === "string") {
        const fixed = value.replace(/'/g, '"');
        const parsed = JSON.parse(fixed);
        return Array.isArray(parsed) ? parsed : [];
      }
  
      return Array.isArray(value) ? value : [];
    } catch (err) {
      console.error("Failed to parse list:", value, err);
      return [];
    }
};
   

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`http://localhost:8001/recipes/${id}`);
      if (!res.ok) {
        setRecipe(null);
        return;
      }
      const data = await res.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-amber-950 text-amber-300 p-8">
        <p>Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-950 text-amber-300 p-8">
      <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>

      {recipe.description && (
        <p className="text-lg mb-6 italic text-amber-400">
          {recipe.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-amber-800 p-4 rounded-lg">
        <p><span className="font-semibold">Time:</span> {recipe.minutes} minutes</p>
        <p><span className="font-semibold">Nutrition:</span> {Array.isArray(recipe.nutrition) ? recipe.nutrition.join(", ") : recipe.nutrition}</p>
        <p><span className="font-semibold">Tags:</span> {Array.isArray(recipe.tags) ? recipe.tags.join(", ") : recipe.tags}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {parseJSONList(recipe.ingredients).map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Steps</h2>
        <ul className="list-decimal list-inside space-y-1">
            {parseJSONList(recipe.steps).map((step, idx) => (
                <li key={idx}>{step}</li>
            ))}
        </ul>
      </div>
      <Chatbot recipeId={recipe.id} />
    </div>
  );
}