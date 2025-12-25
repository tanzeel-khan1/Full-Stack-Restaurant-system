import { useEffect, useState } from "react";
import API from "../../utils/api";
import ProtectedAdmin from "../../components/ProtectedAdmin";
import { useNavigate, Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <ProtectedAdmin>
      <div className="min-h-screen bg-[#181C14] text-amber-400 p-6">
        <Link
          to="/admin"
          className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 mb-5
             rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
             shadow-md transition-all duration-300 ease-in-out
             hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
        >
          <FaLongArrowAltLeft />
          <span>Go Back</span>
        </Link>
        <h2 className="text-2xl font-bold mb-6">All Users</h2>

        {err && (
          <div className="text-red-500 bg-red-100 p-3 rounded mb-4">{err}</div>
        )}

        {loading ? (
          <div className="text-center text-amber-400">Loading users...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-[#20251C] border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-[#2B3224] text-amber-400">
                <tr>
                  <th className="p-3 border-b border-gray-700 text-left">#</th>
                  <th className="p-3 border-b border-gray-700 text-left">
                    Name
                  </th>
                  <th className="p-3 border-b border-gray-700 text-left">
                    Email
                  </th>
                  <th className="p-3 border-b border-gray-700 text-left">
                    Role
                  </th>
                  <th className="p-3 border-b border-gray-700 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u, i) => (
                    <tr
                      key={u._id}
                      className="hover:bg-[#2B3224] transition border-b border-gray-700"
                    >
                      <td className="p-3 text-sm">{i + 1}</td>
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            u.role === "admin"
                              ? "bg-green-900 text-green-400"
                              : "bg-gray-800 text-gray-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="px-3 py-1 bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-400 font-medium"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}
