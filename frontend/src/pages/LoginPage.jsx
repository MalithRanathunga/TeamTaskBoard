import React from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="h-screen w-screen bg-white flex items-center justify-center p-3 sm:p-5 font-sans overflow-hidden">
      {/* Main Container */}
      <div className="w-full h-full max-w-300 flex flex-col lg:flex-row gap-6 lg:gap-10 items-stretch">

        <div className="lg:w-[45%] w-full h-full rounded-[28px] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-[#00d2ff] via-[#1a44e8] to-[#c084fc] shrink-0 shadow-lg">

          <div className="z-10">
            <span className="text-white text-3xl font-bold leading-none select-none">
              ✱
            </span>
          </div>

          {/* Ambient glow element */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-sky-300/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-64 h-64 bg-fuchsia-400/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-900/50 rounded-full blur-2xl pointer-events-none" />

          {/* Bottom Content */}
          <div className="z-10 text-white space-y-2">
            <p className="text-xs sm:text-sm font-medium text-white/80 tracking-wide">
              Live Sync Workspace
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug tracking-tight">
              Your shared space for effortless task management and team clarity.
            </h2>
          </div>
        </div>

        <div className="lg:w-[55%] w-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-2">

          <div className="text-indigo-600 text-2xl font-bold leading-none mb-3 select-none">
            ✱
          </div>

          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 mb-5 leading-relaxed max-w-md">
            Access your tasks, notes and projects anytime, anywhere.
          </p>

          {/* Form */}
          <form className="space-y-4 max-w-md w-full">
            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 tracking-wide">
                Your email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sign in Button */}
            <Link
              to="/home"
              className="w-full block text-center py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] mt-4! no-underline"
            >
              Sign In
            </Link>
          </form>

          {/* Social sign in buttons */}
          <div className="relative my-5 max-w-md flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute uppercase tracking-wider">
              or continue with
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 max-w-md">
            <button
              type="button"
              className="flex-1 h-9 bg-slate-100/80 hover:bg-slate-200/80 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center max-w-md text-xs text-slate-500 mt-5">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;