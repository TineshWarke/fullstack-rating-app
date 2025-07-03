import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [filter, setFilter] = useState("");
    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const fetchData = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setStats(res.data.stats);
        setUsers(res.data.users);
        setStores(res.data.stores);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(filter.toLowerCase()) ||
            u.email.toLowerCase().includes(filter.toLowerCase()) ||
            u.address.toLowerCase().includes(filter.toLowerCase()) ||
            u.role.toLowerCase().includes(filter.toLowerCase())
    );

    const filteredStores = stores.filter(
        (s) =>
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.email.toLowerCase().includes(filter.toLowerCase()) ||
            s.address.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded shadow">Users: {stats.totalUsers}</div>
                <div className="bg-green-100 p-4 rounded shadow">Stores: {stats.totalStores}</div>
                <div className="bg-yellow-100 p-4 rounded shadow">Ratings: {stats.totalRatings}</div>
            </div>

            <input
                placeholder="Search by name/email/address/role"
                className="w-full p-2 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            <div>
                <h3 className="text-xl font-semibold mt-4 mb-2">Users</h3>
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Role</th>
                            <th className="p-2 border">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u.id}>
                                <td className="p-2 border">{u.name}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border">{u.address}</td>
                                <td className="p-2 border">{u.role}</td>
                                <td className="p-2 border">{u.averageRating || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <h3 className="text-xl font-semibold mt-4 mb-2">Stores</h3>
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Address</th>
                            <th className="p-2 border">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.map((s) => (
                            <tr key={s.id}>
                                <td className="p-2 border">{s.name}</td>
                                <td className="p-2 border">{s.email}</td>
                                <td className="p-2 border">{s.address}</td>
                                <td className="p-2 border">{s.averageRating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
