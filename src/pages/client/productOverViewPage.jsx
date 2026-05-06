import {useNavigate, useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/loader.jsx';
import ImageSlider from '../../components/imageSlider.jsx';

export default function ProductOverviewPage() {
    const params = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [status, setStatus] = useState('loading')

    const formatCurrency = (value) => `Rs. ${Number(value ?? 0).toFixed(2)}`

    useEffect(() => {
        if (!params?.productId) {
            console.error('Missing productId in route params', params)
            setStatus('error')
            toast.error('Missing product ID.')
            return
        }
        const token = localStorage.getItem('token');
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/get/${params.productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => {
                const data = res.data;
                const normalizedProduct = Array.isArray(data)
                    ? data[0] || null
                    : data?.product || data?.data || data || null;

                setProduct(normalizedProduct)
                setStatus('success')
                toast.success('Product fetched successfully!')
            })
            .catch((err) => {
                console.error('Error fetching product:', err);
                setStatus('error')
                toast.error('Failed to fetch product.')
            })
    }, [params.productId])

    const getCart = () => {
        try {
            const raw = localStorage.getItem('cart')
            return raw ? JSON.parse(raw) : []
        } catch (e) {
            return []
        }
    }

    const saveCart = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    const handleAddToCart = () => {
        if (!product) return toast.error('No product to add.')
        const id = product?.productId ?? product?.id ?? product?._id
        const cart = getCart()
        const existing = cart.find((item) => item.id === id)
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1
        } else {
            cart.push({
                id,
                name: product.name,
                price: Number(product.actualPrice ?? product.labelledPrice ?? 0),
                quantity: 1,
                image: product.images?.[0] ?? null,
            })
        }
        saveCart(cart)
        toast.success('Added to cart')
    }

    const handleBuyNow = () => {
        handleAddToCart()
        navigate('/checkout')
    }
    const hasDiscount = Number(product?.labelledPrice ?? 0) > Number(product?.actualPrice ?? 0)
    const discountPercent = hasDiscount
        ? Math.round(((Number(product?.labelledPrice) - Number(product?.actualPrice)) / Number(product?.labelledPrice)) * 100)
        : 0

    return (
        <div className="min-h-screen w-full bg-linear-to-b from-amber-50 via-white to-stone-100 px-4 py-6 sm:px-6 lg:px-12">
            <div className="mx-auto mb-5 flex w-full max-w-7xl items-center justify-start">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-400 hover:bg-stone-50"
                >
                    ← Back
                </button>
            </div>

            {status === 'loading' && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <Loader />
                </div>
            )}

            {status === 'success' && (
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 rounded-3xl border border-stone-200 bg-white/80 p-5 shadow-xl backdrop-blur-sm md:p-8 lg:grid-cols-2">
                    <div className="flex flex-col items-center justify-start">
                        <ImageSlider images={product?.images || []} />

                        <div className="mt-6 w-full max-w-md">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={!product}
                                    className="flex-1 rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
                                >
                                    Add to Cart
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBuyNow}
                                    disabled={!product}
                                    className="flex-1 rounded-xl border border-amber-600 bg-white px-4 py-3 text-sm font-semibold text-amber-600 shadow-sm hover:bg-amber-50 disabled:opacity-50"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-stone-500">
                                {product?.category || 'Furniture Collections'}
                            </p>
                            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 md:text-4xl">
                                {product?.name || 'Untitled product'}
                            </h1>
                            <p className="mt-3 text-base leading-7 text-stone-600">
                                {product?.description || 'No description available.'}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-3xl font-extrabold text-amber-800">
                                    {formatCurrency(product?.actualPrice)}
                                </p>
                                <p className="text-lg text-stone-500 line-through">
                                    {formatCurrency(product?.labelledPrice)}
                                </p>
                                {hasDiscount && (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>
                            <p className="mt-3 text-sm font-medium text-stone-600">
                                Product ID: {product?.productId || 'N/A'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Brand</p>
                                <p className="mt-1 text-base font-semibold text-stone-800">{product?.brand || 'Furnitures'}</p>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Material</p>
                                <p className="mt-1 text-base font-semibold text-stone-800">{product?.material || 'Wood'}</p>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Color</p>
                                <p className="mt-1 text-base font-semibold text-stone-800">{product?.color || 'Natural'}</p>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Weight</p>
                                <p className="mt-1 text-base font-semibold text-stone-800">
                                    {Number(product?.weight ?? 0).toFixed(2)} kg
                                </p>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Stock</p>
                                <p className="mt-1 text-base font-semibold text-stone-800">{product?.stock ?? 0} items</p>
                            </div>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                                <p className="text-xs uppercase tracking-wider text-stone-500">Availability</p>
                                <p className={`mt-1 text-base font-semibold ${product?.isAvailable ? 'text-emerald-700' : 'text-red-600'}`}>
                                    {product?.isAvailable ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Dimensions</h2>
                            <p className="mt-2 text-base font-medium text-stone-800">
                                {product?.dimensions?.length ?? 0} x {product?.dimensions?.width ?? 0} x {product?.dimensions?.height ?? 0}{' '}
                                {product?.dimensions?.unit || 'cm'}
                            </p>
                        </div>

                        {Array.isArray(product?.altNames) && product.altNames.length > 0 && (
                            <div className="rounded-2xl border border-stone-200 p-4 sm:p-5">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Also Known As</h2>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {product.altNames.map((name, index) => (
                                        <span
                                            key={`${name}-${index}`}
                                            className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-lg">
                    <h1 className="text-3xl font-bold text-red-700">Error</h1>
                    <p className="mt-3 text-lg text-red-600">Failed to fetch product.</p>
                </div>
            )}
        </div>
    )
}