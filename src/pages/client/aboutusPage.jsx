export default function AboutUsPage() {
    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white py-6 px-4">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 text-6xl opacity-20">🛋️</div>
                <div className="absolute bottom-10 left-10 text-6xl opacity-20">🪑</div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="mb-4 inline-block">
                        <span className="text-amber-200 text-lg font-semibold tracking-widest">WELCOME TO</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                        About Our
                        <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent"> Furniture Shop</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-amber-100 mb-8 font-light tracking-wide">Crafting Comfort, Creating Dreams</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-200 to-orange-200 mx-auto"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
                {/* Mission Section */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                            We are dedicated to providing high-quality furniture that combines exceptional style with practical functionality. Our mission is to help you transform your living space into a sanctuary of comfort and beauty.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Whether you're searching for modern minimalist designs, timeless classics, or rustic charm, we have the perfect pieces to match your vision and lifestyle.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-8 shadow-lg">
                        <div className="text-6xl mb-4">🎨</div>
                        <p className="text-gray-700 text-lg">
                            Every piece in our collection is carefully selected to ensure it meets our high standards for quality, aesthetics, and durability.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Why Choose Us</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                            <div className="text-5xl mb-4">✨</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                            <p className="text-gray-600">
                                Each furniture piece is crafted with precision using the finest materials to ensure longevity and beauty.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                            <div className="text-5xl mb-4">💡</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Design Excellence</h3>
                            <p className="text-gray-600">
                                Our curated collection features contemporary designs from talented designers worldwide.
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                            <div className="text-5xl mb-4">🤝</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Customer Care</h3>
                            <p className="text-gray-600">
                                Your satisfaction is our priority. We offer exceptional support and reliable delivery services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vision Section */}
                <div className="bg-white rounded-lg shadow-lg p-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Vision</h2>
                    <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                        We envision becoming your go-to destination for furniture that transforms houses into homes. We believe that quality furniture shouldn't compromise on style, and beautiful design should always be accessible.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our commitment extends beyond products—we aim to build lasting relationships with our customers and be part of creating memorable spaces where families gather and memories are made.
                    </p>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-12 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Space?</h3>
                    <p className="text-lg text-gray-600 mb-8">
                        Explore our collection and find the perfect furniture pieces for your home.
                    </p>
                    <a href="/products" className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Browse Our Collection
                    </a>
                </div>
            </div>
        </div>
    )
}