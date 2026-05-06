import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../../components/loader.jsx';
import ImageSlider from '../../components/imageSlider.jsx';

export default function ProductOverviewPage() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/get/${params.productId}`, {
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

    return (    
        <div className="w-full h-full flex justify-center items-center">
            {
                status === 'loading' &&  <Loader />
            }
            {
                status === 'success' && (
                    <div className="w-full h-full flex flex-row justify-start items-start p-8 gap-8">
                        <div className="w-[40%] h-full flex flex-col justify-center items-center">
                            { <ImageSlider images={product?.images || []} />
                            ) : (
                                <div className="w-full h-100 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500 font-medium">
                                    No image available
                                </div>
                            )}
                        </div>
                        <div className="w-[60%] h-full flex flex-col justify-start items-start">
                            <h1 className="text-3xl font-bold mb-4">{product?.name || 'Untitled product'}</h1>
                            <p className="text-lg text-gray-700 mb-2">{product?.description || 'No description available.'}</p>
                            <p className="text-xl font-semibold text-gray-800">
                                Price: Rs.{Number(product?.actualPrice ?? product?.price ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                )
            }
            {
                status === 'error' && (
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8">
                        <h1 className="text-3xl font-bold mb-4">Error</h1>
                        <p className="text-lg text-gray-700 mb-2">Failed to fetch product.</p>
                    </div>
                )
            }
        </div>
    )
}