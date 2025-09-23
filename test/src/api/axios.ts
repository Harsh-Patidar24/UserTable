import axios from "axios";
// import { getAllUsers } from "../../../Server/Controller/userController";

const API_BASE_URL = "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
//   withCredentials: true,
});

export const userApi =  {
  register: (email: String, password: Number) => {
    return api.post("/auth/register", { email, password });
  },

  login: (email: String, password: Number) => {
    return api.post("/auth/login", { email, password });
  },

  logout: () => {
    return api.post("/auth/logout");
  },

  getAllUsers: () => {
    return api.get("/users");
  },

  getUserById: (id: String) => {
    return api.get(`/users/${id}`);
  },

   createUser: async (userData: { name: string; lastName: string; age: number }) => {
    try {
      const response = await api.post("/users", userData);
      return response;
    } catch (error) {
      console.error("Create user error:", error);
      throw error;
    }
  },

  updateUser: (
    id: String,
    userData: { name: String; lastName: String; age: Number }
  ) => {
    return api.put(`/users/${id}`, userData);
  },

  deleteUser: (id: String) => {
    return api.delete(`/users/${id}`);
  },
};
export default axios;
