import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowLeft } from "react-icons/fi"
import Loader from "../../components/loader"

export default function MyOrdersPage() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("Please log in to view orders")
                navigate("/login")
                return
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/get/1/100`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (response.data?.orders) {
                setOrders(response.data.orders)
                if (response.data.orders.length === 0) {
                    toast.info("No orders found")
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error)
            toast.error(error?.response?.data?.message || "Failed to load orders")
        } finally {
            setLoading(false)
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <FiClock className="text-yellow-600" size={20} />
            case "confirmed":
            case "processing":
                return <FiPackage className="text-blue-600" size={20} />
            case "shipped":
                return <FiTruck className="text-orange-600" size={20} />
            case "delivered":
                return <FiCheckCircle className="text-emerald-600" size={20} />
            default:
                return <FiPackage className="text-stone-600" size={20} />
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "confirmed":
            case "processing":
                return "bg-blue-100 text-blue-800"
            case "shipped":
                return "bg-orange-100 text-orange-800"
            case "delivered":
                return "bg-emerald-100 text-emerald-800"
            default:
                return "bg-stone-100 text-stone-800"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-amber-50 via-white to-stone-100">
                <Loader />
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-amber-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">My Orders</h1>
                        <p className="mt-2 text-lg text-stone-600">Track and manage your furniture orders</p>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-md">
                        <FiPackage size={48} className="mx-auto mb-4 text-stone-400" />
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">No Orders Yet</h2>
                        <p className="text-stone-600 mb-6">Start shopping to place your first order!</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id || order.orderId}
                                className="rounded-2xl border border-stone-200 bg-white shadow-md hover:shadow-lg transition"
                            >
                                {/* Order Header */}
                                <button
                                    onClick={() =>
                                        setExpandedOrder(expandedOrder === order._id ? null : order._id)
                                    }
                                    className="w-full"
                                >
                                    <div className="flex items-center justify-between gap-4 p-6 hover:bg-stone-50 rounded-2xl transition">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="shrink-0">
                                                {getStatusIcon(order.status)}
                                            </div>
                                            <div className="text-left grow">
                                                <p className="text-sm font-medium text-stone-600">Order</p>
                                                <p className="text-lg font-bold text-stone-900">
                                                    {order.orderId || "N/A"}
                                                </p>
                                                <p className="text-xs text-stone-500 mt-1">
                                                    {formatDate(order.date || order.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm text-stone-600">Total</p>
                                                <p className="text-xl font-bold text-amber-700">
                                                    Rs. {(order.total || 0).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status
                                                        ? order.status.charAt(0).toUpperCase() +
                                                        order.status.slice(1)
                                                        : "Pending"}
                                                </span>
                                            </div>
                                            <div className="text-stone-400">
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${
                                                        expandedOrder === order._id ? "rotate-180" : ""
                                                    }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Order Details - Expanded */}
                                {expandedOrder === order._id && (
                                    <div className="border-t border-stone-200 bg-stone-50 p-6">
                                        {/* Customer Info */}
                                        <div className="mb-6 pb-6 border-b border-stone-200">
                                            <h3 className="font-semibold text-stone-900 mb-4">Delivery Information</h3>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div>
                                                    <p className="text-xs text-stone-600 uppercase">Name</p>
                                                    <p className="font-medium text-stone-900">{order.name || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-stone-600 uppercase">Email</p>
                                                    <p className="font-medium text-stone-900">{order.email || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-stone-600 uppercase">Phone</p>
                                                    <p className="font-medium text-stone-900">{order.phone || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-stone-600 uppercase">Status</p>
                                                    <p className="font-medium text-emerald-600">
                                                        {order.status
                                                            ? order.status.charAt(0).toUpperCase() +
                                                            order.status.slice(1)
                                                            : "Pending"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-xs text-stone-600 uppercase">Address</p>
                                                <p className="font-medium text-stone-900">{order.address || "N/A"}</p>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mb-6 pb-6 border-b border-stone-200">
                                                <h3 className="font-semibold text-stone-900 mb-4">Items Ordered</h3>
                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex gap-3 rounded-lg bg-white p-3 border border-stone-200"
                                                        >
                                                            {item.images && (
                                                                <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-stone-100 border border-stone-300">
                                                                    <img
                                                                        src={item.images}
                                                                        alt={item.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="grow">
                                                                <p className="font-semibold text-stone-900">
                                                                    {item.name}
                                                                </p>
                                                                <div className="mt-1 flex gap-4 text-sm">
                                                                    <span className="text-stone-600">
                                                                        Qty:{" "}
                                                                        <span className="font-medium">
                                                                            {item.quantity}
                                                                        </span>
                                                                    </span>
                                                                    <span className="text-amber-700 font-medium">
                                                                        Rs.{" "}
                                                                        {(
                                                                            item.actualPrice *
                                                                            item.quantity
                                                                        ).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Order Summary */}
                                        <div className="rounded-lg bg-white p-4 border border-stone-200">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-stone-900">Subtotal</span>
                                                <span className="text-amber-700 font-medium">
                                                    Rs. {(order.subtotal || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="font-semibold text-stone-900">Shipping</span>
                                                <span className="text-orange-600 font-medium">
                                                    Rs. {(order.shippingCharges || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-4 border-t border-stone-200 pt-4">
                                                <span className="font-semibold text-stone-900">Total Amount</span>
                                                <span className="text-2xl font-bold text-amber-700">
                                                    Rs. {(order.total || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
