import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { getCart, addToCart, removeFromCart, clearCart, saveCart } from "../../utils/cart"
import { MdDelete } from "react-icons/md"
import { FiMinus, FiPlus } from "react-icons/fi"
import axios from "axios";

export default function CheckoutPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState([])
    const [shipping, setShipping] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })

    useEffect(() => {
        try {
            // If an item was passed through navigation state
            const incoming = location?.state?.item
            const isBuyNow = location?.state?.buyNow

            if (incoming) {
                if (isBuyNow) {
                    // Buy Now: Replace cart with just this item
                    saveCart([incoming])
                } else {
                    // Regular add to cart: Add to existing cart
                    addToCart(incoming, 1)
                }
            }
            setCart(getCart() || [])
        } catch (error) {
            console.error("Error loading cart:", error)
            toast.error("Failed to load cart")
        } finally {
            setLoading(false)
        }
    }, [location])

    async function handlePlaceOrder() {
        if (cart.length === 0) {
            toast.error("Your cart is empty")
            return
        }

        // Validate shipping details
        if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address) {
            toast.error("Please fill in all shipping details")
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please log in to place your order")
            navigate("/login")
            return
        }

        const items = cart.map((item) => ({
            productId: item.productId || item.id,
            quantity: Number(item.quantity || 1),
        }))

        const order = {
            items,
            name: shipping.name,
            email: shipping.email,
            phone: shipping.phone,
            address: shipping.address
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders/create`, order, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("Order created:", response.data)
            toast.success("Order placed — thank you!")
            clearCart()
            setCart([])
            navigate("/order-success", { state: { orderTotal: total, order: response.data } })
        } catch (error) {
            console.error("Error placing order:", error)
            const backendMessage = error?.response?.data?.message
            toast.error(backendMessage || "Failed to place order")
        }
    }

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            setCart(getCart() || [])
            toast.success("Item removed from cart")
            return
        }
        const product = cart.find(item => item.productId === productId || item.id === productId)
        if (product) {
            const quantityDifference = newQuantity - (product.quantity || 1)
            addToCart(product, quantityDifference)
            setCart(getCart() || [])
        }
    }

    const handleRemove = (productId) => {
        removeFromCart(productId)
        setCart(getCart() || [])
        toast.success("Item removed from cart")
    }

    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            clearCart()
            setCart([])
            toast.success("Cart cleared")
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0)
    const shippingEstimate = subtotal > 0 ? 250 : 0
    const total = subtotal + shippingEstimate


    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-stone-100">
                <div className="text-stone-600">Loading cart...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">Checkout</h1>
                        <p className="mt-1 text-sm text-stone-600">Review your items and enter shipping details</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/products")}
                            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                        >
                            ← Continue Shopping
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Items in your cart</h2>
                            <div className="space-y-4">
                                {cart.length === 0 ? (
                                    <div className="rounded-lg border border-stone-100 bg-stone-50 p-6 text-center text-stone-600">Your cart is empty</div>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.productId || item.id} className="flex items-center gap-4">
                                            <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                                                {item.images?.[0] ? (
                                                    <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xs text-stone-400">No image</div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-stone-900">{item.name}</h3>
                                                        <p className="text-xs text-stone-500">Rs. {Number(item.price).toFixed(2)}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-1">
                                                            <button onClick={() => handleQuantityChange(item.productId || item.id, (item.quantity || 1) - 1)} className="p-1 text-stone-600 hover:text-stone-900 rounded"><FiMinus size={16} /></button>
                                                            <span className="px-2 text-sm font-medium">{item.quantity || 1}</span>
                                                            <button onClick={() => handleQuantityChange(item.productId || item.id, (item.quantity || 1) + 1)} className="p-1 text-stone-600 hover:text-stone-900 rounded"><FiPlus size={16} /></button>
                                                        </div>
                                                        <button onClick={() => handleRemove(item.productId || item.id)} className="mt-2 text-xs text-red-600 hover:underline flex items-center gap-1"><MdDelete /> Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-md">
                            <h2 className="text-lg font-semibold text-stone-900 mb-4">Delivery & Contact Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={shipping.name}
                                        onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={shipping.email}
                                        onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                                        placeholder="customer@example.com"
                                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={shipping.phone}
                                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                                        placeholder="+94771234577"
                                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Delivery Address</label>
                                    <textarea
                                        value={shipping.address}
                                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                        placeholder="1234 Main Street, Colombo"
                                        rows="3"
                                        className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-stone-900 mb-4">Order Summary</h2>
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-stone-600">
                                    <span>Subtotal</span>
                                    <span>Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-stone-600 mt-2">
                                    <span>Shipping</span>
                                    <span>Rs. {shippingEstimate.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-200">
                                <span className="text-lg font-semibold text-stone-900">Total ({cart.length} items)</span>
                                <span className="text-2xl font-bold text-amber-700">Rs. {total.toFixed(2)}</span>
                            </div>

                            <button onClick={handlePlaceOrder} className="w-full rounded-xl bg-amber-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-amber-700 transition mb-3">Place Order</button>

                            <button onClick={handleClearCart} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition">Clear Cart</button>

                            <p className="mt-4 text-xs text-stone-500">Secure checkout &amp; easy returns. We deliver across Sri Lanka.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}