import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
    const { user } = useAuth();
    const [stores, setStores] = useState([]);
    const [search, setSearch] = useState("");
    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fetchStores = async () => {
        const res = await axios.get("http://localhost:5000/api/user/stores", {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setStores(res.data);
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleRatingSubmit = async (storeId, rating) => {
        await axios.post(
            "http://localhost:5000/api/user/rate",
            { storeId, rating },
            { headers: { Authorization: `Bearer ${user.token}` } }
        );
        fetchStores(); // refresh list
    };

    const filtered = stores.filter(
        (store) =>
            store.name.toLowerCase().includes(search.toLowerCase()) ||
            store.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Browse & Rate Stores</h2>

            <input
                className="w-full p-2 border rounded"
                placeholder="Search by store name or address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((store) => (
                    <div key={store.id} className="border p-4 rounded shadow">
                        <h3 className="text-lg font-semibold">{store.name}</h3>
                        <p className="text-sm text-gray-600">{store.address}</p>
                        <p className="mt-1">Overall Rating: {store.averageRating || "N/A"}</p>
                        <p>Your Rating: {store.userRating || "Not rated yet"}</p>
                        <div className="mt-2 space-x-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    className={`px-2 py-1 rounded border ${store.userRating === n ? "bg-blue-500 text-white" : "bg-gray-100"
                                        }`}
                                    onClick={() => handleRatingSubmit(store.id, n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="bg-red-600 text-white px-4 py-2 rounded absolute top-4 right-4"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}
