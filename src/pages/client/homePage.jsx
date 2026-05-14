import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-stone-50">
            {/* Hero Section */}
            <div className="w-full bg-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left - Product Image */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="text-9xl">🪑</div>
                                <div className="absolute top-4 -right-12 text-6xl">🪴</div>
                            </div>
                        </div>

                        {/* Right - Content */}
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Make Experience <span className="text-amber-700">Luxury</span>
                                <br />
                                Embrace <span className="text-amber-700">Simplicity</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Transform your space with our exquisite collection of furniture that combines impeccable design with ultimate comfort.
                            </p>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                                >
                                    Shop Now
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center gap-2 text-amber-700 hover:text-amber-900 hover:bg-amber-100 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                >
                                    ▶ Get Started <br /> Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                        <div className="text-5xl mb-4">⭐</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Quality<br/>Craftsmanship</h3>
                        <p className="text-gray-600">We are committed to delivering only the finest quality</p>
                    </div>

                    <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                        <div className="text-5xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Stylish<br/>Elegance</h3>
                        <p className="text-gray-600">Premium designs with sophisticated aesthetics</p>
                    </div>

                    <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                        <div className="text-5xl mb-4">😊</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Customer<br/>Satisfaction</h3>
                        <p className="text-gray-600">Your satisfaction is our utmost priority</p>
                    </div>
                </div>
            </div>

            {/* About Our Store */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">About Our Store</h2>
                    <div className="h-1 w-24 bg-amber-700 mx-auto mb-8"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Since our establishment, we've been committed to delivering exceptional furniture that combines style, comfort, and quality. Our curated collection features pieces from talented designers worldwide, ensuring we have something for every home and budget.
                    </p>
                </div>
            </div>

            {/* Our Collections */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Collections</h2>
                        <div className="h-1 w-24 bg-amber-700 mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our diverse range of furniture collections designed for every room and lifestyle
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {[
                            { icon: '🛋️', title: 'Living Room', desc: 'Comfortable sofas & seating' },
                            { icon: '🛏️', title: 'Bedroom', desc: 'Beds & bedroom essentials' },
                            { icon: '🍽️', title: 'Dining', desc: 'Tables & dining sets' },
                            { icon: '🪑', title: 'Office', desc: 'Desks & office furniture' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate('/products')}
                                className="bg-amber-50 rounded-lg p-8 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer text-center"
                            >
                                <div className="text-5xl mb-4">{item.icon}</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
                    <div className="h-1 w-24 bg-amber-700 mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">✨</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                        <p className="text-gray-600">
                            Each piece is crafted with precision using the finest materials to ensure longevity, comfort, and aesthetic appeal.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">💡</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Design Excellence</h3>
                        <p className="text-gray-600">
                            Our curated collection features contemporary and classic designs that complement any interior style.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">🤝</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Customer Care</h3>
                        <p className="text-gray-600">
                            Your satisfaction is our priority. We offer exceptional support, reliable delivery, and hassle-free returns.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">💳</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Affordable Prices</h3>
                        <p className="text-gray-600">
                            Quality furniture doesn't have to break the bank. We offer competitive pricing and regular promotions.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">🚚</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
                        <p className="text-gray-600">
                            We ensure your furniture arrives on time and in perfect condition with our reliable delivery service.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-5xl mb-4">🔒</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure Shopping</h3>
                        <p className="text-gray-600">
                            Shop with confidence. Your personal and payment information is protected with the latest security measures.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-amber-50 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Quick Links</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white hover:bg-amber-100 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            🛍️ Shop Products
                        </button>
                        <button
                            onClick={() => navigate('/about-us')}
                            className="bg-white hover:bg-amber-100 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            ℹ️ About Us
                        </button>
                        <button
                            onClick={() => navigate('/contact-us')}
                            className="bg-white hover:bg-amber-100 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            📞 Contact Us
                        </button>
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="bg-white hover:bg-amber-100 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors shadow-md"
                        >
                            📦 My Orders
                        </button>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="bg-amber-900 rounded-lg p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
                    <p className="text-lg text-amber-100 mb-8 max-w-2xl mx-auto">
                        Browse our extensive collection of premium furniture and find the perfect pieces for your home today.
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-white text-amber-900 hover:bg-stone-100 font-bold py-3 px-8 rounded-full transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-[#213C51] to-[#2d5266] text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">About Us</h3>
                            <p className="text-gray-400">
                                Premium furniture store dedicated to transforming your house into a beautiful home.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                            <ul className="text-gray-400 space-y-2">
                                <li><button onClick={() => navigate('/products')} className="hover:text-white transition-colors">Products</button></li>
                                <li><button onClick={() => navigate('/about-us')} className="hover:text-white transition-colors">About</button></li>
                                <li><button onClick={() => navigate('/contact-us')} className="hover:text-white transition-colors">Contact</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Contact</h3>
                            <p className="text-gray-400">
                                📞 +94 77 123 4567<br />
                                ✉️ info@furnitureshop.com<br />
                                📍 Colombo, Sri Lanka
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                            <div className="flex gap-6">
                                <a href="https://facebook.com/furnitureshop" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-amber-500 transition-colors hover:scale-110 duration-300" title="Facebook">
                                    <FaFacebook />
                                </a>
                                <a href="https://instagram.com/furnitureshop" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-amber-500 transition-colors hover:scale-110 duration-300" title="Instagram">
                                    <FaInstagram />
                                </a>
                                <a href="https://tiktok.com/@furnitureshop" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-amber-500 transition-colors hover:scale-110 duration-300" title="TikTok">
                                    <FaTiktok />
                                </a>
                                <a href="https://twitter.com/furnitureshop" target="_blank" rel="noopener noreferrer" className="text-3xl hover:text-amber-500 transition-colors hover:scale-110 duration-300" title="Twitter">
                                    <FaTwitter />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 Furniture Shop. All rights reserved. Crafting Comfort, Creating Dreams.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}