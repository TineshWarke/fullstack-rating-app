import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StoreOwnerDashboard() {
    const { user } = useAuth();
    const [store, setStore] = useState(null);
    const [form, setForm] = useState({ name: "", address: "" });
    const { logout } = useAuth();


    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fetchMyStore = async () => {
        const res = await axios.get("http://localhost:5000/api/store/my", {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setStore(res.data);
        setForm({ name: res.data.name, address: res.data.address });
    };

    useEffect(() => {
        fetchMyStore();
    }, []);

    const handleUpdate = async () => {
        await axios.put(
            "http://localhost:5000/api/store/my",
            { ...form },
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
        fetchMyStore();
    };

    if (!store) return <div className="p-6">Loading store data...</div>;

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">My Store</h2>

            <div className="space-y-2">
                <label className="block">Store Name</label>
                <input
                    className="w-full p-2 border rounded"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <label className="block mt-2">Store Address</label>
                <input
                    className="w-full p-2 border rounded"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
                    onClick={handleUpdate}
                >
                    Update Store Info
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold">Average Rating: {store.averageRating || "N/A"}</h3>
            </div>

            {store.ratings && (
                <div>
                    <h3 className="text-lg font-semibold mt-4">User Ratings</h3>
                    <ul className="list-disc list-inside">
                        {store.ratings.map((r, idx) => (
                            <li key={idx}>
                                {r.userName} rated: <strong>{r.rating}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                className="bg-red-600 text-white px-4 py-2 rounded absolute top-4 right-4"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}
