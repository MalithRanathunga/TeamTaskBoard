import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="h-screen w-screen bg-white text-slate-800 font-sans overflow-hidden flex flex-col justify-between px-6 pt-6 pb-3 lg:px-10 lg:pt-8 lg:pb-4">

      {/* 1. Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between shrink-0">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 no-underline select-none">
          <span className="text-2xl font-black leading-none">✱</span>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            CollabBoard
          </span>
        </Link>

        {/* Auth Buttons */}
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

      {/* 2. Main Content */}
      <main className="w-full max-w-4xl mx-auto flex-1 min-h-0 flex flex-col justify-center items-center text-center my-auto py-2">

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 select-none">
          <span className="text-xs">✱</span>
          <span>Next-Gen Agile Workspace</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl">
          Your shared space for effortless{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            task management
          </span>{" "}
          and team clarity.
        </h1>

        <p className="text-slate-500 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
          Access your sprint boards, track tasks from To Do to Done, and collaborate with your team in real time without friction.
        </p>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0 leading-none">
        <div className="flex items-center gap-1 font-bold text-slate-600">
          <span className="text-indigo-600 text-xs">✱</span> CollabBoard
        </div>
        <p>© 2026 CollabBoard. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;