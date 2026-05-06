import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import uploadFile from "../utils/mediaUpload";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePreview, setProfilePreview] = useState("");
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setIsUploading(true);
            const previewUrl = URL.createObjectURL(file);
            setProfilePreview(previewUrl);

            toast.loading("Uploading profile picture...");
            const uploadedUrl = await uploadFile(file);
            toast.dismiss();

            setProfilePicture(uploadedUrl);
            toast.success("Profile picture uploaded!");
        } catch (error) {
            toast.dismiss();
            setProfilePreview("");
            setProfilePicture("");
            toast.error(error.message || "Failed to upload profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    async function register(event) {
        event.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/users/register",
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    profilePicture,
                }
            );

            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
            }

            toast.success(response.data?.message || "Registration successful!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed!");
        }
    }

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-amber-950 via-stone-900 to-amber-900 flex flex-col justify-center items-center relative overflow-hidden py-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>

            <div className="relative w-full max-w-md px-6 py-12 sm:w-115 sm:px-0">
                <div className="bg-stone-800 bg-opacity-40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-700 border-opacity-50 p-8 sm:p-10 hover:border-amber-500 hover:border-opacity-30 transition duration-500">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl sm:text-3xl font-bold text-amber-50 mb-2">Create your account</h1>
                        <p className="text-amber-100 text-sm">Join FurniShop to save favorites and checkout faster</p>
                    </div>

                    <form className="space-y-5" onSubmit={register}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-amber-50 mb-2">First Name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-amber-50 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full h-12 rounded-lg px-4 pr-12 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="absolute right-4 top-3.5 text-slate-400">✉️</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="0771234567"
                                className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Profile Picture</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full border border-amber-600 bg-stone-700 bg-opacity-50 overflow-hidden flex items-center justify-center shrink-0">
                                    {profilePreview ? (
                                        <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-amber-200 text-xs text-center px-2">No image</span>
                                    )}
                                </div>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureChange}
                                    />
                                    <div className="w-full h-12 rounded-lg px-4 flex items-center justify-between bg-stone-700 bg-opacity-50 border border-amber-600 text-amber-100 hover:border-amber-500 transition duration-300">
                                        <span>{profilePicture ? "Image uploaded" : "Choose image"}</span>
                                        <span className="text-slate-400 text-sm">{isUploading ? "Uploading..." : "Browse"}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-12 rounded-lg px-4 pr-12 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-3.5 text-amber-400 hover:text-amber-300 transition focus:outline-none"
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-12 rounded-lg px-4 pr-12 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-4 top-3.5 text-amber-400 hover:text-amber-300 transition focus:outline-none"
                                >
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className="w-full h-12 mt-4 bg-linear-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:scale-105 active:scale-95 transition duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-amber-700 text-center">
                        <p className="text-amber-100 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-amber-400 hover:text-amber-300 transition duration-300 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-amber-700 text-xs mt-6">Protected by enterprise-grade security</p>
            </div>
        </div>
    );
}