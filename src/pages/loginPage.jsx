import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {useGoogleLogin} from '@react-oauth/google';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const googleLogin = useGoogleLogin(
        {
            onSuccess: async (tokenRes) => {
                try {
                    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/google-login", {
                        token: tokenRes.access_token
                    });
                    localStorage.setItem("token", response.data.token);
                    toast.success("Login successful!");
                    if(response.data.role == "admin"){
                        navigate("/admin")
                    } else if(response.data.role == "user"){
                        navigate("/")
                    }
                } catch (error) {
                    console.error(error);
                    toast.error("Google login failed!");
                }
            }
        }
    )

    async function login(){
        await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
            email: email,
            password: password
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");
            if(response.data.role == "admin"){
                navigate("/admin")
            } else if(response.data.role == "user"){
                navigate("/")
            }
        }).catch((error) => {
            console.error(error);
            toast.error("Login failed!");
        });
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md px-6 py-12 sm:w-[420px] sm:px-0">
                <div className="bg-stone-800 bg-opacity-40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-amber-700 border-opacity-50 p-8 sm:p-10 hover:border-amber-500 hover:border-opacity-30 transition duration-500">
                    
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl sm:text-3xl font-bold text-amber-50 mb-2">Welcome to FurniShop</h1>
                        <p className="text-amber-100 text-sm">Sign in to explore our premium furniture collection</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                        {/* Email Field */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-amber-50 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span className="absolute right-4 top-3.5 text-slate-400">✉️</span>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-amber-50">Password</label>
                                <a href="#" className="text-xs text-amber-400 hover:text-amber-300 transition">Forgot?</a>
                            </div>
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

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 bg-stone-700 border border-amber-600 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-amber-100 cursor-pointer hover:text-amber-50 transition">Remember me</label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            onClick={login}
                            className="w-full h-12 mt-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:scale-105 active:scale-95 transition duration-200 shadow-lg"
                        >
                            Sign In
                        </button>

                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={() => googleLogin()}
                            className="w-full h-12 mt-4 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:scale-105 active:scale-95 transition duration-200 shadow-md flex items-center justify-center gap-2"
                        >
                            <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />
                            Sign in with Google
                        </button>

                    </div>

                    {/* Register Link */}
                    <div className="mt-8 pt-6 border-t border-amber-700 text-center">
                        <p className="text-amber-100 text-sm">
                            Don't have an account?{" "}
                            <Link 
                                to="/register" 
                                className="font-semibold text-amber-400 hover:text-amber-300 transition duration-300 hover:underline"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-amber-700 text-xs mt-6">Protected by enterprise-grade security</p>
            </div>
        </div>
    )
}