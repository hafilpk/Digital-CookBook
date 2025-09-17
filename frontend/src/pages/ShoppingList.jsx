import { useEffect, useState } from "react";
import api from "../services/api";

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    async function fetchList() {
      const pantryRes = await api.get("/pantry/");
      const pantryItems = pantryRes.data;

      const entriesRes = await api.get("/entries/");
      const mealEntries = entriesRes.data;

      let required = [];
      for (const entry of mealEntries) {
        for (const ri of entry.recipe.recipe_ingredients) {
          required.push({ name: ri.ingredient.name, quantity: ri.quantity, unit: ri.unit });
        }
      }

      const missing = required.filter((r) => !pantryItems.some(p => p.ingredient.name === r.name));
      setShoppingList(missing);
    }

    fetchList();
  }, []);

  return (
    <div>
      <h2>Shopping List</h2>
      <ul className="list-group">
        {shoppingList.map((i, idx) => (
          <li key={idx} className="list-group-item">
            {i.name} — {i.quantity} {i.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
