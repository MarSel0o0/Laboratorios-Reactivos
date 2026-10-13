import axios from "axios";
import type { User } from "../types/users";
import type { Credentials } from "../types/crendentials";
import axiosSecure from "../utils/axiosSecure";

const login = async (credentials: Credentials) => {
    const response = await axios.post<User>("/api/login", credentials);

    const csrfToken = response.headers["x-csrf-token"];
    if (csrfToken) {
        localStorage.setItem("csrfToken", csrfToken);
    }

    return response.data;
};

const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get<User>("/api/login/me");
        return response.data;
    } catch {
        return null;
    } 
};

const logout = async () => {
    await axios.post("/api/logout");
    localStorage.removeItem("csrfToken");
};

export default { login, restoreLogin, logout };