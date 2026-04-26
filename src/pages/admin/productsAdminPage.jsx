import { BiPlus } from 'react-icons/bi';
import { Link, useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import axios from 'axios';

export default function ProductsAdminPage() {
    const [products, setProducts] = useState([])
    const navigate = useNavigate()

    const toggleAvailability = (index) => {
        const updatedProducts = [...products];
        updatedProducts[index].isAvailable = !updatedProducts[index].isAvailable;
        setProducts(updatedProducts);
    };

    const deleteProduct = (productId, productName) => {
        // Ask for confirmation
        const confirmed = window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
        
        if (!confirmed) return;

        const token = localStorage.getItem('token');
        
        axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/products/delete/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            // Remove the deleted product from the list
            setProducts(products.filter(p => p.productId !== productId));
            alert('Product deleted successfully!');
        })
        .catch((err) => {
            console.error('Error deleting product:', err);
            alert('Failed to delete product. Please try again.');
        });
    };

    //backend data retrieval
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res)=>{
            const data = res.data;
            // Handle different API response structures
            if (Array.isArray(data)) {
                setProducts(data);
            } else if (Array.isArray(data?.product)) {
                setProducts(data.product);
            } else if (Array.isArray(data?.data)) {
                setProducts(data.data);
            } else if (Array.isArray(data?.products)) {
                setProducts(data.products);
            } else {
                console.warn('Unexpected API response structure:', data);
                setProducts([]);
            }
        })
        .catch((err)=>{
            console.error('Error fetching products:', err);
            setProducts([])
        })
    }, [])

    return (
        <div className='w-full h-full bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 md:p-8 overflow-auto'>
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Manage Products</h1>
                        <p className="text-amber-100 text-sm sm:text-base md:text-lg">Total Products: <span className="font-bold">{products.length}</span></p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className='bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-x-auto border-2 border-gray-200'>
                <table className='w-full'>
                    <thead className='bg-gradient-to-r from-amber-700 to-amber-600 text-white sticky top-0'>
                        <tr>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>ID</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Name</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Price</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Stock</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Category</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Brand</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Material</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Color</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Status</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide'>Image</th>
                            <th className='border-b-2 border-gray-300 p-3 sm:p-4 text-center text-xs sm:text-sm font-bold uppercase tracking-wide'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className='p-6 text-center text-gray-500 font-semibold'>
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, index) => (
                                    <tr key={index} className='border-b border-gray-200 hover:bg-amber-50 transition duration-200'>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm font-mono font-bold text-gray-700'>{product.productId}</td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-800 max-w-[200px] break-words'>{product.name}</td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm'>
                                            <div className='text-gray-600 text-xs mb-1'>
                                                <span className='font-semibold'>Listed:</span> Rs {product.labelledPrice?.toLocaleString() || '0'}
                                            </div>
                                            <div className='text-green-700 font-bold text-xs'>
                                                <span className='font-semibold'>Actual:</span> Rs {product.actualPrice?.toLocaleString() || '0'}
                                            </div>
                                        </td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <span className={`font-bold px-2 py-1 rounded text-white text-xs ${product.stock > 20 ? 'bg-green-500' : product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                    {product.stock || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm text-gray-700 font-medium'>{product.category || 'N/A'}</td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm text-gray-700 font-medium'>{product.brand || 'N/A'}</td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm text-gray-700 font-medium'>{product.material || 'N/A'}</td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <div
                                                    className='w-6 h-6 rounded-full border-2 border-gray-300'
                                                    style={{ backgroundColor: product.color?.toLowerCase() || '#999999' }}
                                                />
                                                <span className='text-gray-700 font-medium'>{product.color || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className='p-3 sm:p-4 text-xs sm:text-sm'>
                                            <button
                                                onClick={() => toggleAvailability(index)}
                                                className={`px-2 sm:px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap transition-all cursor-pointer hover:shadow-md ${product.isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                                            >
                                                {product.isAvailable ? '✅ Available' : '❌ Unavailable'}
                                            </button>
                                        </td>
                                        <td className='p-3 sm:p-4'>
                                            {product.images && product.images[0] && (
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.name} 
                                                    className='w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200 hover:shadow-lg transition'
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/64x64?text=No+Image'}
                                                />
                                            ) || (
                                                <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs'>No image</div>
                                            )}
                                        </td>
                                        <td className='p-3 sm:p-4'>
                                            <div className='flex gap-1 sm:gap-2 justify-center flex-wrap'>
                                                <button 
                                                    onClick={() => navigate(`/admin/products/${product.productId}`)} 
                                                    className='px-2 sm:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded transition shadow-md hover:shadow-lg'
                                                >
                                                    👁️ View
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/admin/products/edit/${product.productId}`)} 
                                                    className='px-2 sm:px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm font-bold rounded transition shadow-md hover:shadow-lg'
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button 
                                                    onClick={() => deleteProduct(product.productId, product.name)}
                                                    className='px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded transition shadow-md hover:shadow-lg'
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Add Product Button */}
            <Link to="/admin/products/addProduct" className='fixed right-[20px] sm:right-[40px] bottom-[20px] sm:bottom-[40px] bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-full p-3 sm:p-4 shadow-2xl cursor-pointer transition-all duration-200 transform hover:scale-110 flex items-center justify-center border-4 border-white'>
                <BiPlus className='text-3xl sm:text-4xl text-white'/>
            </Link>
        </div>
    )
}
