import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { getCart, addToCart, removeFromCart, clearCart } from "../../utils/cart"
import { MdDelete } from "react-icons/md"
import { FiMinus, FiPlus } from "react-icons/fi"

export default function CartPage() {
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        try {
            setCart(getCart())
        } catch (error) {
            console.error("Error loading cart:", error)
            toast.error("Failed to load cart")
        } finally {
            setLoading(false)
        }
    }, [])

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId)
            setCart(getCart())
            toast.success("Item removed from cart")
            return
        }
        const product = cart.find(item => item.productId === productId || item.id === productId)
        if (product) {
            const quantityDifference = newQuantity - (product.quantity || 1)
            addToCart(product, quantityDifference)
            setCart(getCart())
        }
    }

    const handleRemove = (productId) => {
        removeFromCart(productId)
        setCart(getCart())
        toast.success("Item removed from cart")
    }

    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            clearCart()
            setCart([])
            toast.success("Cart cleared")
        }
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
    const taxRate = 0.1
    const tax = subtotal * taxRate
    const total = subtotal + tax

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
                    <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">Shopping Cart</h1>
                    <button
                        onClick={() => navigate("/products")}
                        className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="rounded-3xl border border-stone-200 bg-white/80 p-12 text-center shadow-lg backdrop-blur-sm">
                        <div className="mx-auto max-w-md">
                            <h2 className="text-2xl font-bold text-stone-900 mb-3">Your cart is empty</h2>
                            <p className="text-stone-600 mb-6">Explore our collection of premium furniture and add items to your cart.</p>
                            <button
                                onClick={() => navigate("/products")}
                                className="w-full rounded-xl bg-amber-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-amber-700 transition"
                            >
                                Browse Products
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.productId || item.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-md hover:shadow-lg transition sm:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <div className="flex-shrink-0">
                                            {item.images?.[0] ? (
                                                <img
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    className="h-24 w-24 object-cover rounded-lg border border-stone-200"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-lg border border-stone-300 bg-stone-100 flex items-center justify-center">
                                                    <span className="text-xs text-stone-500">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-stone-900 mb-2">{item.name}</h3>
                                            <p className="text-2xl font-bold text-amber-700 mb-4">
                                                Rs. {Number(item.price).toFixed(2)}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-2">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId || item.id,
                                                                (item.quantity || 1) - 1
                                                            )
                                                        }
                                                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded transition"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus size={18} />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-stone-900">
                                                        {item.quantity || 1}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId || item.id,
                                                                (item.quantity || 1) + 1
                                                            )
                                                        }
                                                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded transition"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus size={18} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-sm text-stone-600">Subtotal</p>
                                                    <p className="text-xl font-bold text-stone-900">
                                                        Rs. {(item.price * (item.quantity || 1)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(item.productId || item.id)}
                                            className="flex-shrink-0 rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 hover:bg-red-100 transition"
                                            aria-label="Remove item"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-3xl border border-stone-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6 pb-6 border-b border-stone-200">
                                    <div className="flex justify-between text-stone-700">
                                        <span>Subtotal ({cart.length} items)</span>
                                        <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-700">
                                        <span>Tax (10%)</span>
                                        <span className="font-medium">Rs. {tax.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mb-6 flex justify-between">
                                    <span className="text-lg font-semibold text-stone-900">Total</span>
                                    <span className="text-2xl font-bold text-amber-700">Rs. {total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full rounded-xl bg-amber-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-amber-700 transition mb-3"
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={handleClearCart}
                                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}