import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="h-screen w-screen bg-white text-slate-800 font-sans overflow-hidden flex flex-col justify-between p-6 lg:p-10">

      {/* 1. Navigation */}
      <header className="w-full max-w-300 mx-auto flex items-center justify-between shrink-0">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 no-underline select-none">
          <span className="text-2xl font-black leading-none">✱</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            CollabBoard
          </span>
        </Link>

        {/* Auth CTA Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors rounded-xl"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all transform active:scale-95 no-underline"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* 2. Main Hero Content */}
      <main className="w-full max-w-225 mx-auto flex-1 flex flex-col justify-center items-center text-center my-auto py-6">

        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 select-none">
          <span className="text-xs">✱</span>
          <span>Next-Gen Agile Workspace</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
          Your shared space for effortless{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            task management
          </span>{" "}
          and team clarity.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mt-4 mb-8 leading-relaxed">
          Access your sprint boards, track tasks from To Do to Done, and collaborate with your team in real time without friction.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group no-underline active:scale-95"
          >
            <span>Start Free Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/board"
            className="w-full sm:w-auto px-7 py-3 bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 font-semibold rounded-xl text-sm transition-all text-center no-underline active:scale-95"
          >
            Explore Board Demo
          </Link>
        </div>

      </main>

      {/* 3. Minimal Single-Line Footer */}
      <footer className="w-full max-w-300 mx-auto border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-1 font-bold text-slate-600">
          <span className="text-indigo-600">✱</span> CollabBoard
        </div>
        <p>© 2026 CollabBoard. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;