import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const { login } = useAuth(); 

    // After successful login
    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });
            const data = res.data;
            login(data); // Save to AuthContext

            if (data.role === "admin") {
                navigate("/admin");
            } else if (data.role === "user") {
                navigate("/user");
            } else if (data.role === "store_owner") {
                navigate("/store-owner");
            } else {
                alert("Unknown role");
            }
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Log In
                </button>
                <p className="text-sm">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-600 underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    );
}
