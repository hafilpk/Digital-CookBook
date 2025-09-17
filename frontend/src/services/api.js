import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

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
  const res = await axios.post("http://127.0.0.1:8000/api/token/", { username, password });
  const { access } = res.data;
  setAuthToken(access);
  return access;
}

export default api;
