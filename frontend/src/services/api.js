import axios from "axios";
import { format } from "date-fns";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

export async function login(username, password) {
  const res = await axios.post(`${API_URL}/token/`, { username, password });
  const { access } = res.data;
  setAuthToken(access);
  return access;
}

export async function createMealPlan(weekStart) {
  const res = await api.post("/mealplans/", { week_start: weekStart });
  return res.data;
}

export async function addMealEntry(mealPlanId, recipeId, date, mealType = "lunch") {
  const res = await api.post("/entries/", {
    mealplan_id: mealPlanId,
    recipe_id: recipeId,
    date: format(new Date(date), "yyyy-MM-dd"),
    meal_type: mealType,
  });
  return res.data;
}

export async function getMealPlans() {
  const res = await api.get("/mealplans/");
  return res.data;
}

export async function getMealEntries(mealPlanId) {
  const res = await api.get(`/entries/?mealplan=${mealPlanId}`);
  return res.data;
}

export async function getRecipes() {
  const res = await api.get("/recipes/");
  return res.data;
}

export default api;
