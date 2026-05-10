import {useEffect, useState} from "react";
import axios from "axios";
import Loader from '../../components/loader';
import PagInator from "../../components/paginator";
import toast from "react-hot-toast";

export default function OrderAdminPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setpage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [totalOrders, setTotalOrders] = useState(0)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [editingStatus, setEditingStatus] = useState("")
    const [editingNotes, setEditingNotes] = useState("")
    const [updating, setUpdating] = useState(false)


    useEffect(()=> {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) {
            console.error("Not found. Please log in.")
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
                setTotalOrders(res.data.total || res.data.orders.length)
                setLoading(false)
                toast.success("Orders loaded successfully")
            })
            .catch(error => {
                console.error("Error fetching orders:", error)
                setLoading(false)
                toast.error("Error fetching orders")
            })
    }, [page, limit])

    async function handleUpdateOrder() {
        if (!selectedOrder) return
        setUpdating(true)
        try {
            console.log("Updating order:", selectedOrder.orderId, {status: editingStatus, notes: editingNotes})

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/update/${selectedOrder.orderId}`,
                { status: editingStatus, notes: editingNotes },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    timeout: 10000
                }
            )
            console.log("Update response:", response.data)
            toast.success("Order updated successfully")

            // Refetch orders to get latest data
            const token = localStorage.getItem("token")
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/get/${page}/${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setOrders(res.data.orders)
            setSelectedOrder(null)
        } catch(err){
            console.error("Error updating order:", err.response?.data || err.message)
            const errorMsg = err.response?.data?.message || err.message || "Error updating order"
            toast.error(errorMsg)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="w-full h-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 md:p-8 overflow-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="bg-linear-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Manage Orders</h1>
                    <p className="text-amber-100 text-sm sm:text-base md:text-lg">Total Orders: <span className="font-bold">{totalOrders}</span></p>
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
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Order ID</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Customer Name</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Email</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Phone</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Address</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Total Amount</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Order Date</th>
                                <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="p-6 text-center text-gray-500 font-semibold">No orders found</td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.orderId} className="border-b border-gray-200 hover:bg-amber-50 transition duration-200 cursor-pointer" onClick={() => {
                                        setEditingStatus(order.status)
                                        setEditingNotes(order.notes || "")
                                        setSelectedOrder(order)}
                                    }>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-mono font-bold text-gray-700">{order.orderId}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-800 font-semibold">{order.name}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{order.email}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{order.phone}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{order.address}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-green-700">Rs.{Number(order.total || 0).toFixed(2)}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                            <span className={`px-2 sm:px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {selectedOrder && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-3xl font-bold text-amber-800">Order Details</h2>
                                    <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Order ID</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{selectedOrder.orderId}</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Status</p>
                                        <span className={`inline-block mt-1 px-3 py-1 rounded-full font-bold text-sm ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Customer Name</p>
                                        <p className="text-xl font-bold text-gray-800 mt-1">{selectedOrder.name}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Subtotal</p>
                                        <p className="text-xl font-bold text-green-700 mt-1">Rs.{Number(selectedOrder.subtotal).toFixed(2)}</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Shipping Fee</p>
                                        <p className="text-xl font-bold text-orange-700 mt-1">Rs.{Number(selectedOrder.shippingCharges || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-700 mt-1">Rs.{Number(selectedOrder.total || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Email</p>
                                        <p className="text-sm text-gray-800 mt-1 break-all">{selectedOrder.email}</p>
                                    </div>
                                    <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-600">
                                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Phone</p>
                                        <p className="text-lg font-semibold text-gray-800 mt-1">{selectedOrder.phone}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Address</p>
                                    <p className="text-gray-800 leading-relaxed">{selectedOrder.address}</p>
                                </div>

                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6">
                                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Order Date</p>
                                    <p className="text-lg font-semibold text-amber-900">{new Date(selectedOrder.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Update Status</p>
                                    <select
                                        value={editingStatus}
                                        onChange={(e) => setEditingStatus(e.target.value)}
                                        className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-6">
                                    <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Order Notes</p>
                                    <textarea
                                        value={editingNotes}
                                        onChange={(e) => setEditingNotes(e.target.value)}
                                        placeholder="Add internal notes about this order..."
                                        rows="3"
                                        className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleUpdateOrder}
                                    disabled={updating}
                                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition mb-4"
                                >
                                    {updating ? "Updating..." : "Save Changes"}
                                </button>

                                {/* Products Section */}
                                {selectedOrder.items && selectedOrder.items.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">📦</span>
                                            Items Ordered
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 bg-gradient-to-r from-amber-50 to-white rounded-lg p-4 border border-amber-200 hover:shadow-md transition">
                                                    {item.images && (
                                                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-300 flex-shrink-0">
                                                            <img
                                                                src={item.images}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800 text-lg">{item.name}</h4>
                                                        <p className="text-gray-600 text-sm mt-1">Product ID: {item.productId}</p>
                                                        <div className="flex gap-6 mt-2">
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Quantity</p>
                                                                <p className="text-lg font-bold text-gray-800">{item.quantity}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Unit Price</p>
                                                                <p className="text-lg font-bold text-amber-700">Rs. {Number(item.actualPrice).toFixed(2)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                                                                <p className="text-lg font-bold text-green-700">Rs. {(item.actualPrice * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Order Summary */}
                                {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                                    <div className="space-y-3">
                                        <div className="">
                                            <span className="text-gray-700 font-semibold">Notes</span>
                                            <span className="text-lg font-bold text-gray-800">{selectedOrder.notes }</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                            <span className="text-gray-700 font-semibold">Subtotal</span>
                                            <span className="text-lg font-bold text-gray-800">Rs. {Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                            <span className="text-gray-700 font-semibold">Shipping Fee</span>
                                            <span className="text-lg font-bold text-orange-700">Rs. {Number(selectedOrder.shippingCharges || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                            <span className="text-2xl font-bold text-green-700">Rs. {Number(selectedOrder.total || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <PagInator currentPage={page} totalPages={totalPages} onPageChange={setpage} limit={limit} setLimit={setLimit} />
            </div>
            )}
        </div>
    )
}
