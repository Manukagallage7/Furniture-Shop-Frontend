import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function sendOTP(event) {
        event.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/send-otp", { email });
            setStep(2);
            toast.success("OTP sent successfully.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function verifyOTP(event) {
        event.preventDefault();

        if (!otp.trim()) {
            toast.error("Please enter the OTP.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/verify-otp", { email, otp });
            setStep(3);
            toast.success("OTP verified successfully.");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    async function resetPassword(event) {
        event.preventDefault();

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.error("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
                email: email,
                otp: otp,
                newPassword: newPassword
            });
            toast.success("Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex flex-col justify-center items-center relative overflow-hidden py-10">
            {/* Animated background elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>

            <div className="relative w-full max-w-md px-6 py-12 sm:w-105 sm:px-0">
                {/* Progress indicator */}
                <div className="mb-8 flex justify-between items-center px-2">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                        step >= 1
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                            : "bg-amber-500/30 text-amber-300 border border-amber-500/60"
                    }`}>
                        1
                    </div>
                    <div className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                        step >= 2 ? "bg-gradient-to-r from-emerald-500/50 to-amber-500/50" : "bg-stone-700/50"
                    }`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                        step >= 2
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                            : "bg-stone-700/50 text-stone-500 border border-stone-600/50"
                    }`}>
                        2
                    </div>
                    <div className={`flex-1 h-1 mx-3 rounded-full transition-all ${
                        step >= 3 ? "bg-gradient-to-r from-emerald-500/50 to-amber-500/50" : "bg-stone-700/50"
                    }`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                        step >= 3
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                            : "bg-stone-700/50 text-stone-500 border border-stone-600/50"
                    }`}>
                        3
                    </div>
                </div>
                <p className="text-center text-amber-700 text-xs mb-8">Step {step} of 3</p>

                <div className="bg-stone-800 bg-opacity-40 backdrop-blur-2xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.55)] border border-amber-700/50 ring-1 ring-white/5 p-8 sm:p-10 hover:border-amber-500/40 hover:ring-amber-500/20 transition duration-500">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        {step === 1 && (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/40 text-3xl shadow-lg shadow-amber-950/50">
                                    🔑
                                </div>
                                <h1 className="text-3xl sm:text-2xl font-bold text-amber-50 mb-2">Recover your password</h1>
                                <p className="text-amber-100 text-sm">Enter your email address and we’ll send you a recovery code</p>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-3xl shadow-lg shadow-amber-950/50">
                                    ✉️
                                </div>
                                <h1 className="text-3xl sm:text-2xl font-bold text-amber-50 mb-2">Enter the code</h1>
                                <p className="text-amber-100 text-sm">We’ve sent a code to {email}. Enter it below to continue</p>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-3xl shadow-lg shadow-amber-950/50">
                                    🔒
                                </div>
                                <h1 className="text-3xl sm:text-2xl font-bold text-amber-50 mb-2">Set new password</h1>
                                <p className="text-amber-100 text-sm">Create a strong password to secure your account</p>
                            </>
                        )}
                    </div>

                    {/* Form */}
                    <form className="space-y-5" onSubmit={step === 1 ? sendOTP : step === 2 ? verifyOTP : resetPassword}>
                        {step === 1 && (
                            <>
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

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition duration-200 shadow-[0_12px_30px_rgba(217,119,6,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    <span>{isSubmitting ? "Sending code..." : "Send Recovery Code"}</span>
                                    {!isSubmitting && <span className="text-lg leading-none">→</span>}
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-50 mb-2">Enter OTP Code</label>
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength="6"
                                        className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300 text-center text-2xl tracking-widest"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition duration-200 shadow-[0_12px_30px_rgba(217,119,6,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    <span>{isSubmitting ? "Verifying..." : "Verify Code"}</span>
                                    {!isSubmitting && <span className="text-lg leading-none">→</span>}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-amber-400 hover:text-amber-300 text-xs transition"
                                >
                                    Change email
                                </button>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-amber-50 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full h-12 rounded-lg px-4 pr-12 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-3.5 text-amber-400 hover:text-amber-300 transition focus:outline-none"
                                        >
                                            {showPassword ? "👁️" : "👁️‍🗨️"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-amber-50 mb-2">Confirm Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full h-12 rounded-lg px-4 bg-stone-700 bg-opacity-50 border border-amber-600 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:bg-opacity-75 transition duration-300"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-stone-800 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition duration-200 shadow-[0_12px_30px_rgba(16,185,129,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    <span>{isSubmitting ? "Resetting..." : "Reset Password"}</span>
                                    {!isSubmitting && <span className="text-lg leading-none">→</span>}
                                </button>
                            </>
                        )}
                    </form>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-amber-700"></div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                        <p className="text-amber-100 text-sm">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-amber-400 hover:text-amber-300 transition duration-300 hover:underline"
                            >
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-amber-700 text-xs mt-6">Protected by enterprise-grade security</p>
            </div>
        </div>
    );
}