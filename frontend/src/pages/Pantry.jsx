import { useEffect, useState } from "react";
import api from "../services/api";

export default function Pantry() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ingredient_id: "", quantity: "", unit: "" });
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get("/pantry/");
      setItems(res.data);

      const ingRes = await api.get("/ingredients/");
      setIngredients(ingRes.data);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post("/pantry/", form);
    setItems([...items, { ...form, ingredient: ingredients.find(i => i.id == form.ingredient_id) }]);
    setForm({ ingredient_id: "", quantity: "", unit: "" });
  };

  const handleDelete = async (id) => {
    await api.delete(`/pantry/${id}/`);
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      <h2>Pantry</h2>
      <form className="mb-3" onSubmit={handleAdd}>
        <div className="row g-2">
          <div className="col">
            <select className="form-select" name="ingredient_id" value={form.ingredient_id} onChange={handleChange} required>
              <option value="">Select Ingredient</option>
              {ingredients.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <input type="number" name="quantity" placeholder="Quantity" className="form-control" value={form.quantity} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="text" name="unit" placeholder="Unit" className="form-control" value={form.unit} onChange={handleChange} required />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary">Add</button>
          </div>
        </div>
      </form>

      <ul className="list-group">
        {items.map((i) => (
          <li key={i.id} className="list-group-item d-flex justify-content-between align-items-center">
            {i.ingredient.name} — {i.quantity} {i.unit}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
