import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function AddProductPage() {
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
    const [imageInput, setImageInput] = useState('');
    const navigate = useNavigate();

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

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput.trim()]
            }));
            setImageInput('');
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
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

            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You must be logged in to add a product');
                navigate('/login');
                return;
            }

            axios.post(import.meta.env.VITE_Backend_URL + "/api/products/create", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((res) => {
                toast.success('Product added successfully!');
                console.log('Product added:', res.data);
                navigate('/admin/products');
            }).catch(error => {
                toast.error('Error adding product: ' + error.message);
                console.error('Error adding product:', error);
                navigate('/admin/products');
            });

            console.log('Product Data:', formData);
            toast.success('Product added successfully!');
            
            // Reset form after successful submission
            setFormData({
                productId: '',
                name: '',
                altNames: [],
                labelledPrice: '',
                actualPrice: '',
                images: [],
                description: '',
                category: 'Furniture Collections',
                stock: '',
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
        } catch (error) {
            toast.error('Error adding product: ' + error.message);
        }
    };

    const handleReset = () => {
        setFormData({
            productId: '',
            name: '',
            altNames: [],
            labelledPrice: '',
            actualPrice: '',
            images: [],
            description: '',
            category: 'Furniture Collections',
            stock: '',
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
        setAltNameInput('');
        setImageInput('');
    };

    return (
        <div className='w-full h-full bg-gray-100 py-8 px-4 overflow-y-auto'>
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Add New Product</h1>
                <p className="text-gray-600 mb-6">Fill in the details below to add a new product to your inventory</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-amber-500">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Product ID */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Product ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="productId"
                                    value={formData.productId}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., PROD001"
                                    required
                                />
                            </div>

                            {/* Product Name */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Product Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., Wooden Dining Table"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., Furniture Collections"
                                    required
                                />
                            </div>

                            {/* Brand */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Brand <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., Furnitures"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2 mt-6">
                            <label className="font-semibold text-gray-700">Description <span className="text-red-500">*</span></label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 resize-none"
                                rows="4"
                                placeholder="Enter product description..."
                                required
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-amber-500">
                            Pricing & Stock
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Labelled Price */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Labelled Price <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="labelledPrice"
                                    value={formData.labelledPrice}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Actual Price */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Actual Price <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="actualPrice"
                                    value={formData.actualPrice}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Stock */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Attributes Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-amber-500">
                            Physical Attributes
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Material */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., Wood"
                                />
                            </div>

                            {/* Color */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="e.g., Natural"
                                />
                            </div>

                            {/* Weight */}
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-gray-700">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Dimensions</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {/* Length */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700">Length</label>
                                    <input
                                        type="number"
                                        name="dimensions.length"
                                        value={formData.dimensions.length}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Width */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700">Width</label>
                                    <input
                                        type="number"
                                        name="dimensions.width"
                                        value={formData.dimensions.width}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Height */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700">Height</label>
                                    <input
                                        type="number"
                                        name="dimensions.height"
                                        value={formData.dimensions.height}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                {/* Unit */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-700">Unit</label>
                                    <select
                                        name="dimensions.unit"
                                        value={formData.dimensions.unit}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
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
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-amber-500">
                            Alternative Names
                        </h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={altNameInput}
                                onChange={(e) => setAltNameInput(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                placeholder="Enter alternative name..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddAltName()}
                            />
                            <button
                                type="button"
                                onClick={handleAddAltName}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                            >
                                Add Name
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.altNames.map((name, index) => (
                                <div key={index} className="bg-amber-100 border border-amber-300 rounded-full px-4 py-2 flex items-center gap-2">
                                    <span className="text-gray-700">{name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAltName(index)}
                                        className="text-red-600 hover:text-red-800 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images Section */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-amber-500">
                            Product Images
                        </h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                                placeholder="Enter image URL..."
                                onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                            />
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
                            >
                                Add Image
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative border border-gray-300 rounded-md overflow-hidden bg-gray-100">
                                    <img
                                        src={image}
                                        alt={`Product ${index}`}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200?text=Image+Error';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
                                    >
                                        ×
                                    </button>
                                    <p className="text-xs text-gray-600 p-2 truncate">{image}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 transform hover:scale-105"
                        >
                            Add Product
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-md transition duration-200"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}