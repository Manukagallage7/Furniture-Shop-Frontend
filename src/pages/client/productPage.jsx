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

    useEffect(() => {
        if (isloading) {
            const token = localStorage.getItem('token')
            if (!token) {
                toast.error("Please log in to view Products")
                navigate("/login")
                return
            }
            axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    const data = res.data

                    if (Array.isArray(data)) {
                        setProducts(data)
                    } else if (Array.isArray(data?.product)) {
                        setProducts(data.product)
                    } else if (Array.isArray(data?.data)) {
                        setProducts(data.data)
                    } else if (Array.isArray(data?.products)) {
                        setProducts(data.products)
                    } else {
                        console.warn('Unexpected products API response:', data);
                    }

                    console.log('Products fetched successfully:', products);
                })
                .catch((err) => {
                    console.error('Error fetching products:', err);
                    setProducts([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isloading]);

    return (
        <div className="w-full min-h-screen bg-amber-700">
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