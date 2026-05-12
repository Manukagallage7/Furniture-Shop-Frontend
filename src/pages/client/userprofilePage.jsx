import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLogOut } from "react-icons/fi"
import Loader from "../../components/loader"

export default function UserProfilePage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchUserProfile()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }

            const decoded = jwtDecode(token)
            const userEmail = decoded.email

            if (!userEmail) {
                toast.error("Invalid token: Email not found")
                navigate("/login")
                return
            }

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setUser(response.data.data)
            setFormData(response.data.data)
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error(error.response?.data?.message || "Failed to load profile")
            if (error.response?.status === 401) {
                navigate("/login")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData(user)
        }
        setIsEditing(!isEditing)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const token = localStorage.getItem("token")
            const decoded = jwtDecode(token)
            const userEmail = decoded.email

            if (!userEmail) {
                toast.error("Invalid token: Email not found")
                return
            }

            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setUser(response.data.data)
            setIsEditing(false)
            toast.success("Profile updated successfully!")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error(error.response?.data?.message || "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged out successfully")
        navigate("/login")
    }

    if (loading) {
        <Loader />
    }

    if (!user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50 via-white to-stone-100">
                <div className="text-center">
                    <p className="text-stone-600 mb-4">Profile not found</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="rounded-lg bg-amber-600 px-6 py-2 text-white font-semibold hover:bg-amber-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-amber-50 via-white to-stone-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">My Profile</h1>
                        <p className="text-stone-600 mt-2">Manage your account information</p>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
                        >
                            ← Back
                        </button>
                    )}
                </div>

                {/* Main Profile Card */}
                <div className="rounded-3xl border border-stone-200 bg-white/90 shadow-xl backdrop-blur-sm overflow-hidden">
                    {/* Profile Header Background */}
                    <div className="h-32 bg-gradient-to-r from-amber-500 to-amber-400"></div>

                    {/* Profile Content */}
                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-8 pb-8 border-b border-stone-200">
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-4 border-white shadow-lg">
                                    <FiUser className="w-16 h-16 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-3xl font-bold text-stone-900 mb-2">{user.name || "User"}</h2>
                                <p className="text-amber-600 font-semibold mb-3">
                                    {user.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                                </p>
                                <div className="flex gap-3">
                                    {!isEditing && (
                                        <>
                                            <button
                                                onClick={handleEditToggle}
                                                className="flex items-center gap-2 rounded-lg bg-amber-600 text-white px-4 py-2 font-semibold hover:bg-amber-700 transition"
                                            >
                                                <FiEdit2 size={18} />
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 text-red-600 px-4 py-2 font-semibold hover:bg-red-100 transition"
                                            >
                                                <FiLogOut size={18} />
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Information Grid */}
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <FiMail className="text-amber-600" size={18} />
                                    Email Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none transition"
                                        placeholder="your@email.com"
                                    />
                                ) : (
                                    <div className="rounded-lg bg-stone-50 px-4 py-3 text-stone-900 font-medium">
                                        {user.email}
                                    </div>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <FiUser className="text-amber-600" size={18} />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.firstName + " " + formData.lastName || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none transition"
                                        placeholder="Your full name"
                                    />
                                ) : (
                                    <div className="rounded-lg bg-stone-50 px-4 py-3 text-stone-900 font-medium">
                                        {user.firstName + " " + user.lastName}
                                    </div>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <FiPhone className="text-amber-600" size={18} />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none transition"
                                        placeholder="+94 123 456 7890"
                                    />
                                ) : (
                                    <div className="rounded-lg bg-stone-50 px-4 py-3 text-stone-900 font-medium">
                                        {user.phone || "Not provided"}
                                    </div>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <FiMapPin className="text-amber-600" size={18} />
                                    Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none transition"
                                        placeholder="Your address"
                                    />
                                ) : (
                                    <div className="rounded-lg bg-stone-50 px-4 py-3 text-stone-900 font-medium">
                                        {user.address || "Not provided"}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                            <div className="mt-6">
                                <label className="text-sm font-semibold text-stone-700 mb-3 block">Bio</label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio || ""}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 focus:border-amber-500 focus:bg-white focus:outline-none transition"
                                        placeholder="Tell us about yourself"
                                    />
                                ) : (
                                    <div className="rounded-lg bg-stone-50 px-4 py-3 text-stone-900">
                                        {user.bio}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Account Info */}
                        <div className="mt-8 pt-8 border-t border-stone-200">
                            <h3 className="text-lg font-semibold text-stone-900 mb-4">Account Information</h3>
                            <div className="grid gap-4 md:grid-cols-2 text-sm">
                                <div className="rounded-lg bg-stone-50 px-4 py-3">
                                    <p className="text-stone-600 mb-1">Account Type</p>
                                    <p className="text-stone-900 font-semibold capitalize">{user.role}</p>
                                </div>
                                <div className="rounded-lg bg-stone-50 px-4 py-3">
                                    <p className="text-stone-600 mb-1">Member Since</p>
                                    <p className="text-stone-900 font-semibold">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 text-white px-6 py-3 font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiSave size={18} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white text-stone-700 px-6 py-3 font-semibold hover:bg-stone-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiX size={18} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Section - Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <button
                        onClick={() => navigate("/orders")}
                        className="rounded-2xl border border-stone-200 bg-white px-6 py-6 text-center hover:shadow-lg transition"
                    >
                        <div className="text-3xl mb-2">📦</div>
                        <h3 className="font-semibold text-stone-900 mb-1">My Orders</h3>
                        <p className="text-sm text-stone-600">View your order history</p>
                    </button>
                    <button
                        onClick={() => navigate("/products")}
                        className="rounded-2xl border border-stone-200 bg-white px-6 py-6 text-center hover:shadow-lg transition"
                    >
                        <div className="text-3xl mb-2">🛋️</div>
                        <h3 className="font-semibold text-stone-900 mb-1">Shop Now</h3>
                        <p className="text-sm text-stone-600">Browse furniture collection</p>
                    </button>
                    <button
                        onClick={() => navigate("/cart")}
                        className="rounded-2xl border border-stone-200 bg-white px-6 py-6 text-center hover:shadow-lg transition"
                    >
                        <div className="text-3xl mb-2">🛒</div>
                        <h3 className="font-semibold text-stone-900 mb-1">Cart</h3>
                        <p className="text-sm text-stone-600">View your shopping cart</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
