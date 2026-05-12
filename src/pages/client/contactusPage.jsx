import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding token:", e);
        return null;
    }
};

export default function ContactUsPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = decodeToken(token);
            if (decoded) {
                setFormData(prev => ({
                    ...prev,
                    email: decoded.email || "",
                    phone: decoded.phone || ""
                }));
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.phone || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const config = {};
            const token = localStorage.getItem("token");
            if (token) {
                config.headers = {
                    Authorization: `Bearer ${token}`
                };
            }

            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact/submit`, payload, config);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            console.error("Submission error:", error.response?.data);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Error sending message";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 text-white py-6 px-4">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 text-6xl opacity-20">📞</div>
                <div className="absolute bottom-10 right-10 text-6xl opacity-20">💬</div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <div className="mb-4 inline-block">
                        <span className="text-amber-200 text-lg font-semibold tracking-widest">LET'S CONNECT</span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                        Get In
                        <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent"> Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-amber-100 mb-8 font-light tracking-wide">We'd love to hear from you. Let's connect!</p>
                    <div className="h-1 w-24 bg-gradient-to-r from-amber-200 to-orange-200 mx-auto"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Contact Information</h2>

                        {/* Phone */}
                        <div className="mb-8 flex items-start gap-4">
                            <div className="text-4xl">📞</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Phone</h3>
                                <a href="tel:+94771234567" className="text-lg text-amber-800 hover:text-amber-900 font-semibold">
                                    +94 77 123 4567
                                </a>
                                <p className="text-gray-600 mt-1">Mon-Sat: 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-8 flex items-start gap-4">
                            <div className="text-4xl">✉️</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Email</h3>
                                <a href="mailto:info@furnitureshop.com" className="text-lg text-amber-800 hover:text-amber-900 font-semibold">
                                    info@furnitureshop.com
                                </a>
                                <p className="text-gray-600 mt-1">We'll respond within 24 hours</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-12 flex items-start gap-4">
                            <div className="text-4xl">📍</div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Visit Us</h3>
                                <p className="text-lg text-gray-600 mb-2">
                                    123 Furniture Street<br />
                                    Colombo, Sri Lanka 10000
                                </p>
                                <p className="text-gray-600">Mon-Sat: 10:00 AM - 7:00 PM</p>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Follow Us</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* WhatsApp */}
                                <a
                                    href="https://wa.me/94771234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                                >
                                    <span className="text-xl">💬</span>
                                    WhatsApp
                                </a>

                                {/* Instagram */}
                                <a
                                    href="https://instagram.com/furnitureshop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                                >
                                    <span className="text-xl">📷</span>
                                    Instagram
                                </a>

                                {/* Facebook */}
                                <a
                                    href="https://facebook.com/furnitureshop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                                >
                                    <span className="text-xl">👍</span>
                                    Facebook
                                </a>

                                {/* Twitter */}
                                <a
                                    href="https://twitter.com/furnitureshop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                                >
                                    <span className="text-xl">𝕏</span>
                                    Twitter
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+94 77 123 4567"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Product Inquiry"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Tell us how we can help..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}