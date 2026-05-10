import {useState, useEffect} from "react";
import axios from "axios";
import Loader from '../../components/loader';
import PagInator from "../../components/paginator";

export default function UserAdminPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [totalUsers, setTotalUsers] = useState(0)

    useEffect(()=> {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("Not found. Please log in.")
            setLoading(false)
            return
        }
        axios.get(import.meta.env.VITE_BACKEND_URL+ `/api/users/users/${page}/${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setUsers(res.data.users)
                setTotalPages(res.data.totalPages)
                const total = res.data.users.length
                setTotalUsers(total)
                setLoading(false)
                console.log("Fetched users:", res.data)
            })
            .catch(error => {
                console.error("Error fetching users:", error)
                setLoading(false)
            })
    }, [page, limit])

    return (
        <div className="w-full h-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 md:p-8 overflow-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="bg-linear-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Manage Users</h1>
                    <p className="text-amber-100 text-sm sm:text-base md:text-lg">Total Users: <span className="font-bold">{totalUsers}</span></p>
                </div>
            </div>

            {/* Table Section */}
            {loading ? (
                <Loader />
            ) : (
            <div className="w-full">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-x-auto border-2 border-gray-200">
                    <table className="w-full">
                        <thead className="bg-linear-to-r from-amber-700 to-amber-600 text-white sticky top-0">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Is Blocked</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">{user._id}</td>
                                    <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">{user.phone}</td>
                                    <td className="py-3 px-4">{user.isBlocked}</td>
                                    <td className="py-3 px-4">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <PagInator
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setpage}
                    limit={limit}
                    setLimit={setLimit}
                    setLoading = {setLoading}
                />
            </div>
            )}
        </div>
    )
}