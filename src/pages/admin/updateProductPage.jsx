import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import uploadFile from '../../utils/mediaUpload';

export default function UpdateProductPage() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        altNames: [],
        labelledPrice: '',
        actualPrice: '',
        images: [],
        description: '',
        category: 'Furniture Collections',
        stock: '',
        isAvailable: true,
        brand: 'Furnitures',
        dimensions: {
            length: '',
            width: '',
            height: '',
            unit: 'cm'
        },
        weight: '',
        material: 'Wood',
        color: 'Natural'
    });

    const [altNameInput, setAltNameInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const selectedProduct = useMemo(() => {
        const product = location.state?.product;
        return product && typeof product === 'object' ? product : null;
    }, [location.state]);

    const initialSnapshotRef = useRef(null);

    useEffect(() => {
        if (!selectedProduct) {
            toast.error('No product selected to edit');
            navigate('/admin/products');
            return;
        }

        const normalized = {
            productId: selectedProduct.productId ?? '',
            name: selectedProduct.name ?? '',
            altNames: Array.isArray(selectedProduct.altNames) ? selectedProduct.altNames : [],
            labelledPrice: selectedProduct.labelledPrice ?? '',
            actualPrice: selectedProduct.actualPrice ?? '',
            images: Array.isArray(selectedProduct.images) ? selectedProduct.images : [],
            description: selectedProduct.description ?? '',
            category: selectedProduct.category ?? 'Furniture Collections',
            stock: selectedProduct.stock ?? '',
            isAvailable: selectedProduct.isAvailable ?? true,
            brand: selectedProduct.brand ?? 'Furnitures',
            dimensions: {
                length: selectedProduct.dimensions?.length ?? '',
                width: selectedProduct.dimensions?.width ?? '',
                height: selectedProduct.dimensions?.height ?? '',
                unit: selectedProduct.dimensions?.unit ?? 'cm'
            },
            weight: selectedProduct.weight ?? '',
            material: selectedProduct.material ?? 'Wood',
            color: selectedProduct.color ?? 'Natural'
        };

        setFormData(normalized);
        setUploadedImageUrls(normalized.images);

        initialSnapshotRef.current = {
            formData: normalized,
            uploadedImageUrls: normalized.images
        };
    }, [navigate, selectedProduct]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.includes('dimensions.')) {
            const dimensionField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                dimensions: {
                    ...prev.dimensions,
                    [dimensionField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleAddAltName = () => {
        if (altNameInput.trim()) {
            setFormData(prev => ({
                ...prev,
                altNames: [...prev.altNames, altNameInput.trim()]
            }));
            setAltNameInput('');
        }
    };

    const handleRemoveAltName = (index) => {
        setFormData(prev => ({
            ...prev,
            altNames: prev.altNames.filter((_, i) => i !== index)
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        
        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select at least one image');
            return;
        }

        try {
            setIsUploading(true);
            toast.loading(`Uploading ${selectedFiles.length} image(s) to Supabase...`);

            // Upload all selected images to Supabase in parallel
            const imageUploadPromises = selectedFiles.map(file => uploadFile(file));
            const urls = await Promise.all(imageUploadPromises);

            // Add uploaded URLs to the list (don't replace, add to existing)
            setUploadedImageUrls(prev => [...prev, ...urls]);
            
            // Clear selected files and previews after successful upload
            setSelectedFiles([]);
            setImagePreviews([]);

            toast.dismiss();
            toast.success(`✅ ${urls.length} image(s) uploaded successfully!`);
            console.log('Uploaded URLs:', urls);
        } catch (error) {
            toast.dismiss();
            toast.error('Error uploading images: ' + error.message);
            console.error('Error uploading images:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveUploadedImage = (index) => {
        setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validation
            if (!formData.productId.trim() || !formData.name.trim() || !formData.description.trim()) {
                toast.error('Please fill all required fields');
                return;
            }

            if (formData.labelledPrice <= 0 || formData.actualPrice <= 0) {
                toast.error('Prices must be greater than 0');
                return;
            }

            if (formData.stock <= 0) {
                toast.error('Stock quantity must be greater than 0');
                return;
            }

            if (uploadedImageUrls.length === 0) {
                toast.error('Please upload images first before submitting');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You must be logged in to update a product');
                navigate('/login');
                return;
            }

            setIsSubmitting(true);
            toast.loading('Updating product...');

            // Create product payload with already uploaded image URLs
            const productPayload = {
                ...formData,
                images: uploadedImageUrls
            };

            // Update product in backend
            const res = await axios.put(
                import.meta.env.VITE_BACKEND_URL + `/api/products/update/${formData.productId}`,
                productPayload,
                {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                }
            );

            toast.dismiss();
            toast.success('✅ Product updated successfully!');
            console.log('Product updated:', res.data);
            setIsSubmitting(false);

            navigate('/admin/products');
        } catch (error) {
            toast.dismiss();
            setIsSubmitting(false);
            toast.error('Error updating product: ' + error.message);
            console.error('Error updating product:', error);
        }
    };

    const handleReset = () => {
        const snapshot = initialSnapshotRef.current;
        if (snapshot?.formData) {
            setFormData(snapshot.formData);
            setUploadedImageUrls(snapshot.uploadedImageUrls ?? []);
            setAltNameInput('');
            setSelectedFiles([]);
            setImagePreviews([]);
            return;
        }

        setAltNameInput('');
        setSelectedFiles([]);
        setImagePreviews([]);
    };

    return (
        <div className='w-full min-h-screen bg-linear-to-br from-stone-50 via-amber-50 to-stone-100 py-6 sm:py-8 md:py-12 px-3 sm:px-4 overflow-y-auto'>
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className='flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm'
                    >
                        ← Back to Products
                    </button>
                </div>

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="bg-linear-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Update Furniture Product</h1>
                        <p className="text-amber-100 text-sm sm:text-base md:text-lg">Edit your product details and save changes</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-amber-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-amber-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900">📋 Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            {/* Product ID */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Product ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition duration-200 text-xs sm:text-sm md:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="e.g., PROD001"
                                    disabled
                                    required
                                />
                            </div>

                            {/* Product Name */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="e.g., Wooden Dining Table"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Category <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="e.g., Furniture Collections"
                                    required
                                />
                            </div>

                            {/* Brand */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Brand <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="e.g., Furnitures"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6">
                            <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 resize-none transition duration-200 text-xs sm:text-sm md:text-base"
                                rows="4"
                                placeholder="Enter detailed product description..."
                                required
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-green-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-green-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">💰 Pricing & Stock</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {/* Labelled Price */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Labelled Price <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="labelledPrice"
                                    value={formData.labelledPrice}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Actual Price */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Actual Price <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="actualPrice"
                                    value={formData.actualPrice}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Stock */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Stock Quantity <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Attributes Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-orange-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-orange-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900">🏗️ Physical Attributes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                            {/* Material */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="e.g., Wood"
                                />
                            </div>

                            {/* Color */}
                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="e.g., Natural"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 sm:gap-2">
                                <label className="font-semibold text-gray-800 text-xs sm:text-sm md:text-sm uppercase tracking-wide">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="mt-6 sm:mt-8 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t-2 border-gray-200">
                            <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 flex items-center"><span className="w-2 h-6 sm:h-6 bg-orange-600 rounded mr-2 sm:mr-3"></span>Dimensions</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
                                {/* Length */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-gray-700 font-semibold text-xs sm:text-sm md:text-sm">Length</label>
                                    <input
                                        type="number"
                                        name="dimensions.length"
                                        value={formData.dimensions.length}
                                        onChange={handleInputChange}
                                        className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Width */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-gray-700 font-semibold text-xs sm:text-sm md:text-sm">Width</label>
                                    <input
                                        type="number"
                                        name="dimensions.width"
                                        value={formData.dimensions.width}
                                        onChange={handleInputChange}
                                        className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Height */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-gray-700 font-semibold text-xs sm:text-sm md:text-sm">Height</label>
                                    <input
                                        type="number"
                                        name="dimensions.height"
                                        value={formData.dimensions.height}
                                        onChange={handleInputChange}
                                        className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Unit */}
                                <div className="flex flex-col gap-1.5 sm:gap-2">
                                    <label className="text-gray-700 font-semibold text-xs sm:text-sm md:text-sm">Unit</label>
                                    <select
                                        name="dimensions.unit"
                                        value={formData.dimensions.unit}
                                        onChange={handleInputChange}
                                        className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition duration-200 bg-white text-xs sm:text-sm md:text-base"
                                    >
                                        <option value="cm">cm</option>
                                        <option value="m">m</option>
                                        <option value="inch">inch</option>
                                        <option value="ft">ft</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alternative Names Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-purple-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-purple-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900">🏷️ Alternative Names</h2>
                        </div>
                        <div className="flex gap-2 mb-3 sm:mb-4">
                            <input
                                type="text"
                                value={altNameInput}
                                onChange={(e) => setAltNameInput(e.target.value)}
                                className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 md:p-3 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition duration-200 text-xs sm:text-sm md:text-base"
                                placeholder="Enter alternative name..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddAltName()}
                            />
                            <button
                                type="button"
                                onClick={handleAddAltName}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 sm:py-3 md:py-3 px-4 sm:px-6 md:px-6 rounded-lg transition duration-200 shadow-md text-xs sm:text-sm md:text-base whitespace-nowrap"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {formData.altNames.map((name, index) => (
                                <div key={index} className="bg-linear-to-r from-purple-100 to-purple-50 border-2 border-purple-300 rounded-full px-3 sm:px-4 md:px-4 py-1.5 sm:py-2 md:py-2 flex items-center gap-1.5 sm:gap-2 shadow-sm text-xs sm:text-sm">
                                    <span className="text-gray-700 font-medium">{name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAltName(index)}
                                        className="text-red-600 hover:text-red-800 font-bold text-lg hover:bg-red-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center transition"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg p-4 sm:p-5 md:p-8 border-l-4 border-blue-600">
                        <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
                            <div className="w-2 h-6 sm:h-8 bg-blue-600 rounded mr-2 sm:mr-3 md:mr-4"></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">🖼️ Product Images</h2>
                        </div>

                        {/* Step 1: Select & Upload Images */}
                        <div className="mb-6 sm:mb-8 md:mb-8 p-3 sm:p-4 md:p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-blue-300">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-blue-900 mb-3 sm:mb-4 flex items-center">📤 Step 1: Upload First</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mb-3 sm:mb-4">
                                <input
                                    multiple
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="flex-1 border-2 border-dashed border-blue-400 rounded-lg sm:rounded-xl md:rounded-xl p-2 sm:p-3 md:p-4 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 transition duration-200 bg-white cursor-pointer hover:border-blue-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-xs sm:text-sm"
                                    disabled={isUploading}
                                />
                                <button
                                    type="button"
                                    onClick={handleUploadImages}
                                    disabled={isUploading || selectedFiles.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 sm:py-3 md:py-3 px-4 sm:px-8 md:px-8 rounded-lg transition duration-200 disabled:cursor-not-allowed whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm md:text-base"
                                >
                                    {isUploading ? `⏳ Uploading...` : `📤 Upload (${selectedFiles.length})`}
                                </button>
                            </div>

                            {/* Pending Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div>
                                    <p className="text-gray-800 font-bold mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">⏳ Pending Images ({imagePreviews.length})</p>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-lg sm:rounded-xl md:rounded-xl border-3 border-yellow-400 bg-yellow-50 shadow-md hover:shadow-lg transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    disabled={isUploading}
                                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 disabled:opacity-50 shadow-lg text-xs sm:text-sm"
                                                >
                                                    ×
                                                </button>
                                                <span className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 2: Uploaded Images */}
                        {uploadedImageUrls.length > 0 && (
                            <div className="p-4 sm:p-6 md:p-8 bg-linear-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl md:rounded-2xl border-2 border-green-400 mt-6 sm:mt-8 md:mt-8">
                                <h3 className="text-sm sm:text-base md:text-lg font-bold text-green-900 mb-1 sm:mb-2 flex items-center">✅ Step 2: Ready for Submission ({uploadedImageUrls.length})</h3>
                                <p className="text-xs sm:text-sm md:text-sm text-green-800 mb-4 sm:mb-6 font-medium">All images uploaded! Fill product details and submit.</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                    {uploadedImageUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-full h-20 sm:h-24 md:h-32 object-cover rounded-lg border-2 border-green-400 bg-green-50"
                                                onError={() => console.error(`Failed to load image ${index + 1}`)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveUploadedImage(index)}
                                                disabled={isSubmitting}
                                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 text-xs sm:text-sm"
                                            >
                                                ×
                                            </button>
                                            <span className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold">
                                                {index + 1}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 md:pt-8 border-t-2 border-gray-300">
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading || uploadedImageUrls.length === 0}
                            className="flex-1 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-400 text-white font-bold py-3 sm:py-4 md:py-4 px-6 sm:px-8 md:px-8 rounded-lg sm:rounded-xl md:rounded-xl transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl text-sm sm:text-base md:text-base"
                        >
                            {isSubmitting ? '⏳ Saving...' : uploadedImageUrls.length > 0 ? '✅ Save Changes' : '📤 Upload Images First'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={isUploading || isSubmitting}
                            className="flex-1 bg-linear-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 sm:py-4 md:py-4 px-6 sm:px-8 md:px-8 rounded-lg sm:rounded-xl md:rounded-xl transition duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base md:text-base"
                        >
                            🔄 Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}