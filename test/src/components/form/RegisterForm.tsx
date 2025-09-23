import React, { useState } from "react";
import api from '../../api/axios';
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContainer";

export default function RegisterForm() {
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { email, password });
      setMessage(response.data.msg);
      if (response.data.msg === "User Regiastered Sucessfully") {
        showToast("Registration successful! Please login to continue.", "success");
        navigate("/login");
      } else {
        showToast(response.data.msg, "info");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data || "Registration failed";
      setMessage(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account?{" "}
        <span 
          onClick={() => navigate("/login")}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Login here
        </span>
      </p>
    </div>
  );
}