import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

const memberColors = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-teal-600",
  "bg-amber-600",
];

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Navbar = ({ activeBoard, onAddTaskClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const members = activeBoard?.members || [];

  return (
    <header className="h-16 w-full bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-indigo-600 leading-none">✱</span>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            {activeBoard?.title || "Workspace Board"}
          </h1>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Sync
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, or assignees..."
            className="w-full pl-9.5 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Members Avatars */}
        <div className="hidden lg:flex items-center -space-x-2 mr-1">
          {members.slice(0, 4).map((member, index) => (
            <div
              key={member._id}
              title={member.name}
              className={`w-7 h-7 rounded-full ${memberColors[index % memberColors.length]
                } text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white`}
            >
              {getInitials(member.name)}
            </div>
          ))}
          {members.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              +{members.length - 4}
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          type="button"
          onClick={onAddTaskClick}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;