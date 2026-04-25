import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setIsLoading(true);
                // Fetch specific product by ID
                const res = await axios.post(
                    import.meta.env.VITE_Backend_URL + "/api/products/get",
                    { productId: productId }
                );
                
                // Find the product with matching ID
                const foundProduct = Array.isArray(res.data) 
                    ? res.data.find(p => p.productId === productId)
                    : res.data;
                
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    toast.error('Product not found');
                    navigate('/admin/products');
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error('Error loading product details');
                navigate('/admin/products');
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProductDetails();
        }
    }, [productId, navigate]);

    if (isLoading) {
        return (
            <div className='w-full h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center'>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-amber-200"></div>
                    <p className="mt-4 text-gray-700 font-semibold">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='w-full h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 flex items-center justify-center'>
                <p className="text-gray-700 font-semibold">Product not found</p>
            </div>
        );
    }

    const calculateDiscount = () => {
        if (product.labelledPrice && product.actualPrice) {
            return Math.round(((product.labelledPrice - product.actualPrice) / product.labelledPrice) * 100);
        }
        return 0;
    };

    const nextImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product.images && product.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-6 sm:py-8 md:py-12 px-3 sm:px-4 overflow-y-auto'>
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-2 mb-6 text-amber-700 hover:text-amber-900 font-semibold transition hover:underline"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </button>

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">{product.name}</h1>
                                <p className="text-amber-100 text-sm sm:text-base md:text-lg">Product ID: <span className="font-mono font-bold">{product.productId}</span></p>
                            </div>
                            <div className="text-right">
                                <span className={`px-4 py-2 rounded-full font-bold text-sm ${product.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {product.isAvailable ? '✅ Available' : '❌ Unavailable'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Images & Pricing Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                        {/* Images Section */}
                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-blue-600">
                            <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                                <div className="w-2 h-6 sm:h-8 bg-blue-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">🖼️ Product Images</h2>
                            </div>

                            {product.images && product.images.length > 0 ? (
                                <div>
                                    {/* Main Image */}
                                    <div className="relative mb-4 sm:mb-6">
                                        <img
                                            src={product.images[currentImageIndex]}
                                            alt={`${product.name} - ${currentImageIndex + 1}`}
                                            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg border-3 border-blue-300 bg-blue-50 shadow-lg"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found'}
                                        />
                                        {product.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                                                >
                                                    ❮
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-10"
                                                >
                                                    ❯
                                                </button>
                                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                    {currentImageIndex + 1} / {product.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnail Gallery */}
                                    {product.images.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {product.images.map((img, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`relative overflow-hidden rounded-lg border-2 transition transform hover:scale-105 ${
                                                        currentImageIndex === index ? 'border-blue-600' : 'border-blue-200 hover:border-blue-400'
                                                    }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-20 object-cover"
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=N/A'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center bg-blue-100 rounded-lg border-3 border-dashed border-blue-300">
                                    <p className="text-gray-500 font-semibold">No images available</p>
                                </div>
                            )}
                        </div>

                        {/* Pricing & Stock Section */}
                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-green-600 h-fit">
                            <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                                <div className="w-2 h-6 sm:h-8 bg-green-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">💰 Pricing & Stock</h2>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                {/* Price Display */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 sm:p-6 border-2 border-green-200">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Labelled Price</p>
                                            <p className="text-3xl sm:text-4xl font-bold text-gray-400 line-through">Rs {product.labelledPrice?.toLocaleString() || '0.00'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase">Actual Price</p>
                                            <p className="text-4xl sm:text-5xl font-bold text-green-700">Rs {product.actualPrice?.toLocaleString() || '0.00'}</p>
                                        </div>
                                        {calculateDiscount() > 0 && (
                                            <div className="bg-red-500 text-white rounded-lg p-3 text-center">
                                                <p className="text-2xl sm:text-3xl font-bold">{calculateDiscount()}% OFF</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Stock Quantity</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${product.stock > 20 ? 'bg-green-500' : product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-800 min-w-fit">{product.stock || 0} units</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-amber-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-amber-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900">📋 Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Category</p>
                                <p className="text-lg sm:text-xl font-bold text-gray-800">{product.category || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Brand</p>
                                <p className="text-lg sm:text-xl font-bold text-gray-800">{product.brand || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-4 sm:p-6">
                            <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Description</p>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm md:text-base">{product.description || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Physical Attributes Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-orange-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-orange-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900">🏗️ Physical Attributes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Material</p>
                                <p className="text-lg sm:text-xl font-bold text-gray-800">{product.material || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Color</p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: product.color?.toLowerCase() || '#999999' }}
                                    ></div>
                                    <p className="text-lg sm:text-xl font-bold text-gray-800">{product.color || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                                <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase mb-2">Weight</p>
                                <p className="text-lg sm:text-xl font-bold text-gray-800">{product.weight || '0'} kg</p>
                            </div>
                        </div>

                        {/* Dimensions */}
                        {product.dimensions && (
                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
                                <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 flex items-center">
                                    <span className="w-2 h-6 bg-orange-600 rounded mr-2 sm:mr-3"></span>
                                    Dimensions
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                                        <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Length</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{product.dimensions.length || '0'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                                        <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Width</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{product.dimensions.width || '0'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                                        <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Height</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{product.dimensions.height || '0'}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
                                        <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Unit</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{product.dimensions.unit || 'cm'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alternative Names Section */}
                    {product.altNames && product.altNames.length > 0 && (
                        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-purple-600">
                            <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                                <div className="w-2 h-6 sm:h-8 bg-purple-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900">🏷️ Alternative Names</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                {product.altNames.map((name, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 rounded-full px-3 sm:px-4 md:px-4 py-1.5 sm:py-2 md:py-2 shadow-sm text-xs sm:text-sm font-medium text-gray-700"
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t-2 border-gray-300">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            ← Back to List
                        </button>
                        <button
                            onClick={() => navigate(`/admin/products/edit/${product._id || product.productId}`)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            ✏️ Edit Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
