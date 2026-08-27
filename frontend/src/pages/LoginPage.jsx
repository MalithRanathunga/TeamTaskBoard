import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center p-3 sm:p-5 font-sans overflow-hidden">
      <div className="w-full h-full max-w-300 flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch">
        <div className="lg:w-[45%] w-full h-full rounded-[28px] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-[#00d2ff] via-[#1a44e8] to-[#c084fc] shrink-0 shadow-lg">
          <div className="z-10">
            <span className="text-white text-3xl font-bold leading-none select-none">✱</span>
          </div>
          <div className="z-10 text-white space-y-2">
            <p className="text-xs sm:text-sm font-medium text-white/80 tracking-wide">Live Sync Workspace</p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug tracking-tight">
              Your shared space for effortless task management and team clarity.
            </h2>
          </div>
        </div>

        <div className="lg:w-[55%] w-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-2">
          <div className="text-indigo-600 text-2xl font-bold leading-none mb-3 select-none">✱</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 mb-5 max-w-md">Access your tasks, notes and projects anytime, anywhere.</p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 tracking-wide">Your email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] mt-4! disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center max-w-md text-xs text-slate-500 mt-5">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;