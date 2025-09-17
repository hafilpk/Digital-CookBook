import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await api.get("/recipes/");
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes", err);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your cookbook!</p>
      <h4>Recipes</h4>
      <ul className="list-group">
        {recipes.map((r) => (
          <li key={r.id} className="list-group-item">{r.title}</li>
        ))}
      </ul>
    </div>
  );
}
