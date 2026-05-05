import {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from '../../components/loader.jsx';
import ProductCard from '../../components/productCard.jsx';

export default function ProductPage() {

    const [products, setProducts] = useState([]);
    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isloading) {
            const token = localStorage.getItem('token');
            axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    const data = Array.isArray(res.data) ? res.data : res.data?.products || [];
                    setProducts(data)
                    setIsLoading(false)
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
                <div className='w-full '>
                    {products.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}