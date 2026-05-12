import {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from '../../components/loader.jsx';
import ProductCard from '../../components/productCard.jsx';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function ProductPage() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [isloading, setIsLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const categories = [
        'Furniture Collections', 'Living Room Furniture', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Decor', 'Lighting', 'Rugs', 'Storage', 'Kids', 'Pet', 'Other'
    ]

    useEffect(() => {
        const t = setTimeout(() => setQuery(searchTerm), 450)
        return () => clearTimeout(t)
    }, [searchTerm])

    useEffect(() => {
        let cancelled = false

        async function fetchProducts() {
            setIsLoading(true)

            const token = localStorage.getItem('token')
            if (!token) {
                toast.error('Please log in to view Products')
                navigate('/login')
                return
            }

            try {
                let res
                // Priority: query -> category -> all
                if (query && query.trim() !== '') {
                    // backend expects route param for search: /api/products/search/:query
                    res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/search/${encodeURIComponent(query)}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } else if (selectedCategory && selectedCategory !== '') {
                    // assumes backend route like /api/products/category/:category
                    res = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/category/${encodeURIComponent(selectedCategory)}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                } else {
                    res = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/get', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                }

                if (cancelled) return

                const data = res.data
                if (Array.isArray(data)) setProducts(data)
                else if (Array.isArray(data?.product)) setProducts(data.product)
                else if (Array.isArray(data?.data)) setProducts(data.data)
                else if (Array.isArray(data?.products)) setProducts(data.products)
                else {
                    console.warn('Unexpected products API response:', data)
                    setProducts([])
                }
            } catch (err) {
                console.error('Error fetching products:', err)
                setProducts([])
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchProducts()

        return () => { cancelled = true }
    }, [query, selectedCategory])

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
            <div className="w-full max-w-6xl mx-auto p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm"
                    />
                </div>
                <div className="w-64">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 text-sm bg-white"
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button
                        onClick={() => { setQuery(''); setSelectedCategory('') }}
                        className="px-3 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {isloading ? (
                <Loader />
            ) : (
                <div className='w-full flex flex-wrap justify-center items-start p-4'>
                    {products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}