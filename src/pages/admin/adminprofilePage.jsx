import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiLogOut, FiShield } from "react-icons/fi"
import Loader from "../../components/loader"

export default function AdminProfilePage() {
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchAdminProfile()
    }, [])

    const fetchAdminProfile = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                toast.error("No authentication token found")
                return
            }

            const decoded = jwtDecode(token)
            const adminEmail = decoded.email

            if (!adminEmail) {
                toast.error("Invalid token: Email not found")
                return
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${adminEmail}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setAdmin(response.data.data)
            setFormData(response.data.data)
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error(error.response?.data?.message || "Failed to load profile")
        } finally {
            setLoading(false)
        }
    }

    const handleEditToggle = () => {
        if (isEditing) {
            setFormData(admin)
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
            const adminEmail = decoded.email

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${adminEmail}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setAdmin(response.data.data)
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
        window.location.href = "/login"
    }

    if (loading) {
        return <Loader />
    }

    if (!admin) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-stone-50 via-amber-50 to-stone-100">
                <div className="text-center">
                    <p className="text-stone-600 mb-4 text-lg font-semibold">Profile not found</p>
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="rounded-lg bg-amber-600 px-6 py-2 text-white font-semibold hover:bg-amber-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 md:p-8 overflow-auto">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="bg-linear-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-3">
                                <FiShield className="text-3xl" />
                                Admin Profile
                            </h1>
                            <p className="text-amber-100 text-sm sm:text-base md:text-lg">Manage your administrator account</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-600 hover:bg-amber-700 px-4 py-2 font-semibold transition"
                            >
                                <FiLogOut size={18} />
                                Logout
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Profile Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border-2 border-gray-200 overflow-hidden">
                    {/* Profile Header Background */}
                    <div className="h-24 sm:h-32 bg-linear-to-r from-amber-600 to-amber-500"></div>

                    {/* Profile Content */}
                    <div className="px-6 sm:px-8 pb-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 sm:-mt-16 mb-8 pb-8 border-b-2 border-gray-200">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center border-4 border-white shadow-lg">
                                    <FiShield className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{admin.firstName} {admin.lastName}</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-bold text-sm">
                                        🛡️ Administrator
                                    </span>
                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={handleEditToggle}
                                        className="flex items-center gap-2 rounded-lg bg-amber-600 text-white px-4 py-2 font-semibold hover:bg-amber-700 transition shadow-md"
                                    >
                                        <FiEdit2 size={18} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Information Grid */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-amber-600 rounded-full"></span>
                                Personal Information
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <FiUser className="text-amber-600" size={18} />
                                        First Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName || ""}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-amber-600 focus:bg-white focus:outline-none transition"
                                            placeholder="First name"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 font-semibold border-2 border-gray-200">
                                            {admin.firstName}
                                        </div>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <FiUser className="text-amber-600" size={18} />
                                        Last Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName || ""}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-amber-600 focus:bg-white focus:outline-none transition"
                                            placeholder="Last name"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 font-semibold border-2 border-gray-200">
                                            {admin.lastName}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <FiMail className="text-amber-600" size={18} />
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-amber-600 focus:bg-white focus:outline-none transition"
                                            placeholder="admin@example.com"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 font-semibold border-2 border-gray-200">
                                            {admin.email}
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <FiPhone className="text-amber-600" size={18} />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone || ""}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-amber-600 focus:bg-white focus:outline-none transition"
                                            placeholder="+94 123 456 7890"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 font-semibold border-2 border-gray-200">
                                            {admin.phone || "Not provided"}
                                        </div>
                                    )}
                                </div>

                                {/* Address - Full Width */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                        <FiMapPin className="text-amber-600" size={18} />
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address || ""}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-amber-600 focus:bg-white focus:outline-none transition"
                                            placeholder="Your address"
                                        />
                                    ) : (
                                        <div className="rounded-lg bg-gray-50 px-4 py-3 text-gray-900 font-semibold border-2 border-gray-200">
                                            {admin.address || "Not provided"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Account Information Section */}
                        <div className="mb-8 pt-8 border-t-2 border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-amber-600 rounded-full"></span>
                                Account Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg p-4 border-l-4 border-amber-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Account Type</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{admin.role}</p>
                                </div>
                                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Member Since</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}
                                    </p>
                                </div>
                                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Account Status</p>
                                    <span className="inline-block px-3 py-1 bg-green-200 text-green-800 rounded-full font-bold text-sm">
                                        ✅ Active
                                    </span>
                                </div>
                                <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-600">
                                    <p className="text-gray-600 text-xs sm:text-sm font-semibold uppercase tracking-wide mb-2">Permissions</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">Full Access</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex gap-3 sm:gap-4 pt-8 border-t-2 border-gray-200">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <FiSave size={20} />
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                    <FiX size={20} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mt-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-5 sm:p-6 hover:shadow-xl transition">
                        <div className="text-4xl mb-3">📊</div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Dashboard</h3>
                        <p className="text-xs sm:text-sm text-gray-600">View analytics and reports</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-5 sm:p-6 hover:shadow-xl transition">
                        <div className="text-4xl mb-3">👥</div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">User Management</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Manage all users</p>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-5 sm:p-6 hover:shadow-xl transition">
                        <div className="text-4xl mb-3">⚙️</div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Settings</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Configure system settings</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
