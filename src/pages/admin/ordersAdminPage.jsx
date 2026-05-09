import {useEffect, useState} from "react";
import axios from "axios";
import Loader from '../../components/loader';
import PagInator from "../../components/paginator";

export default function OrderAdminPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)


    useEffect(()=> {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("No token found. Please log in.")
            setLoading(false)
            return
        }
        axios.get(import.meta.env.VITE_BACKEND_URL+ `/api/orders/get/${page}/${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                setOrders(res.data.orders)
                setTotalPages(res.data.totalPages)
                setLoading(false)
                console.log("Fetched orders:", res.data)
            })
            .catch(error => {
                console.error("Error fetching orders:", error)
                setLoading(false)
            })
    }, [page, limit])

    return (

        <div className="w-full h-full flex flex-col items-center p-4">
            <span className="text-xl font-bold mb-2">Orders Admin Page</span>
            <p className="text-sm text-gray-500">Welcome to the Orders Page!</p>
            <p className="text-sm text-gray-500">Here you can view and manage all customer orders.</p>
            {loading ? (
                <Loader />
            ) : (
            <div className="w-full max-w-4xl mt-6">
                <table className="w-full h-full border-collapse">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Order ID</th>
                        <th className="border p-2 text-left">Customer Name</th>
                        <th className="border p-2 text-left">Email</th>
                        <th className="border p-2 text-left">Phone</th>
                        <th className="border p-2 text-left">Address</th>
                        <th className="border p-2 text-left">Total Amount</th>
                        <th className="border p-2 text-left">Order Date</th>
                        <th className="border p-2 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                            <td className="border p-2">{order.orderId}</td>
                            <td className="border p-2">{order.name}</td>
                            <td className="border p-2">{order.email}</td>
                            <td className="border p-2">{order.phone}</td>
                            <td className="border p-2">{order.address}</td>
                            <td className="border p-2">Rs.{order.total.toFixed(2)}</td>
                            <td className="border p-2">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="border p-2">{order.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <PagInator
                    currentPage={page}
                    totalPages={totalPages}
                    setPage={setpage}
                    limit={limit}
                    setLimit={setLimit}
                />
            </div>
            )}
        </div>
    )
}
