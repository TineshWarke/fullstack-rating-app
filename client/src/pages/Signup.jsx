import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/signup", form);
            alert("Signup successful, please login.");
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSignup}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold">Signup</h2>

                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={20}
                    maxLength={60}
                    placeholder="Full Name (20-60 characters)"
                    className="w-full p-2 border rounded"
                />

                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />

                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    maxLength={400}
                    placeholder="Address (max 400 characters)"
                    className="w-full p-2 border rounded"
                />

                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    pattern="(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}"
                    title="Password must be 8-16 characters, include 1 uppercase and 1 special character"
                    placeholder="Password (8-16 chars, incl. 1 uppercase & 1 special)"
                    className="w-full p-2 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
