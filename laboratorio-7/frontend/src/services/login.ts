import axios from "axios";
import axiosSecure from "../utils/axiosSecure";

type Credentials = {
  username: string;
  password: string;
};

export const login = async (credentials: Credentials) => {
  const response = await axios.post("/api/login", credentials);

  const csrfToken = response.headers["x-csrf-token"];

  if (csrfToken) {
    localStorage.setItem("csrfToken", csrfToken);
  }

  return response.data;
};

export const restoreLogin = async () => {
  try {
    const response = await axiosSecure.get("/api/login/me");
    return response.data;
  } catch {
    return null;
  }
};

export const logout = async () => {
  await axios.post("/api/login/logout");
  localStorage.removeItem("csrfToken");
};
