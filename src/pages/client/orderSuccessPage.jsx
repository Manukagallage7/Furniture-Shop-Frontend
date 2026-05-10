import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { FiCheckCircle, FiTruck, FiHome } from "react-icons/fi"

export default function OrderSuccessPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const orderData = location?.state?.order || {}
    const orderTotal = location?.state?.orderTotal || 0

    if (!orderData?.orderId) {
        return (
            <div className="min-h-screen w-full bg-linear-to-b from-amber-50 via-white to-stone-100 px-4 py-8 flex items-center justify-center">
                <div className="max-w-2xl text-center">
                    <h1 className="text-2xl font-bold text-stone-900 mb-4">Order data not found</h1>
                    <p className="text-stone-600 mb-6">We couldn't retrieve your order details. Check your email or contact support.</p>
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="rounded-xl bg-amber-600 px-6 py-3 text-base font-semibold text-white hover:bg-amber-700 transition"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-amber-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50"></div>
                            <FiCheckCircle size={80} className="relative text-emerald-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-stone-600">Thank you for your purchase. Your order has been successfully placed.</p>
                </div>

                {/* Order Details Card */}
                <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-lg mb-8">
                    <div className="grid gap-6 md:grid-cols-2 mb-6 pb-6 border-b border-stone-200">
                        <div>
                            <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Order ID</p>
                            <p className="text-2xl font-bold text-amber-700 mt-1">{orderData?.orderId || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-stone-600 uppercase tracking-wide">Order Total</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">Rs. {orderTotal.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mb-6 pb-6 border-b border-stone-200">
                        <h2 className="text-lg font-semibold text-stone-900 mb-4">Delivery Information</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-stone-600">Full Name</p>
                                <p className="font-semibold text-stone-900">{orderData?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-stone-600">Email</p>
                                <p className="font-semibold text-stone-900">{orderData?.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-stone-600">Phone</p>
                                <p className="font-semibold text-stone-900">{orderData?.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-stone-600">Status</p>
                                <p className="font-semibold text-emerald-600 uppercase">{orderData?.status || "Pending"}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-stone-600">Delivery Address</p>
                            <p className="font-semibold text-stone-900">{orderData?.address || "N/A"}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    {orderData?.items && orderData.items.length > 0 && (
                        <div className="mb-6 pb-6 border-b border-stone-200">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Order Items</h2>
                            <div className="space-y-3">
                                {orderData.items.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 rounded-lg bg-stone-50 p-4">
                                        {item.image && (
                                            <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-white">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                        <div className="grow">
                                            <p className="font-semibold text-stone-900">{item.name}</p>
                                            <div className="mt-1 flex items-center gap-4 text-sm">
                                                <span className="text-stone-600">Qty: <span className="font-medium">{item.quantity}</span></span>
                                                <span className="text-amber-700 font-medium">Rs. {(item.actualPrice * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Next Steps */}
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                        <div className="flex gap-3">
                            <FiTruck className="text-amber-700 shrink-0 mt-1" size={20} />
                            <div>
                                <p className="font-semibold text-amber-900">What's Next?</p>
                                <p className="text-sm text-amber-800 mt-1">We'll prepare your order and send you a shipping confirmation via email within 24 hours.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="flex-1 rounded-xl bg-amber-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-amber-700 transition"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate("/products")}
                        className="flex-1 rounded-xl border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Contact Info */}
                <div className="mt-8 text-center text-sm text-stone-600">
                    <p>Need help? Contact us at <span className="font-semibold">support@furnitureshop.com</span></p>
                </div>
            </div>
        </div>
    )
}
