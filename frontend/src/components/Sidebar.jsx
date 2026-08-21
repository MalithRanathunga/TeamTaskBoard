import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Plus, Kanban, Users, Settings, LogOut, ChevronDown, CheckSquare, Sparkles } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState("board-1");

  // Mock data
  const boards = [
    { id: "board-1", name: "Sprint 1 Workspace", count: 9 },
    { id: "board-2", name: "UI/UX Redesign", count: 4 }
  ];

  const members = [
    { id: "1", name: "Malith Ranathunga", initials: "MR", role: "Owner", online: true, color: "bg-blue-600" },
    { id: "2", name: "Sarah Connor", initials: "SC", role: "Dev", online: true, color: "bg-indigo-600" },
    { id: "3", name: "Alex Rivera", initials: "AR", role: "Designer", online: false, color: "bg-purple-600" },
  ];

  return (
    <aside className="w-64 sm:w-72 h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 select-none">

      {/* Workspace Header */}
      <div className="flex flex-col gap-5">

        {/* Workspace Brand Dropdown */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              ✱
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 truncate">Dev Workspace</h2>
              <p className="text-[11px] text-slate-400 font-medium">Free Team Plan</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 transition-transform" />
        </div>

        {/* Create Board */}
        <button
          type="button"
          onClick={() => alert("Open Create Board Modal")}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Board</span>
        </button>

        {/* Navigation Sections */}
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">

          {/* Quick Views */}
          <div>
            <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Views
            </span>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span>My Assigned Tasks</span>
              </button>
            </div>
          </div>

          {/* Existing Boards List */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Boards ({boards.length})
              </span>
            </div>
            <div className="space-y-1">
              {boards.map((board) => {
                const isActive = activeBoard === board.id;
                return (
                  <button
                    key={board.id}
                    type="button"
                    onClick={() => setActiveBoard(board.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-indigo-50/80 text-indigo-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Kanban className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="truncate">{board.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${isActive
                        ? "bg-indigo-100/70 text-indigo-700"
                        : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      {board.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board Members */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Board Members
              </span>
              <button
                type="button"
                onClick={() => alert("Open Invite Member Modal")}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
              >
                + Invite
              </button>
            </div>
            <div className="space-y-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <div className={`w-7 h-7 rounded-full ${member.color} text-white text-[10px] font-bold flex items-center justify-center`}>
                        {member.initials}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-white ${member.online ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate leading-tight">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-tight">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Settings & User Profile Card */}
      <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Workspace Settings</span>
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              MR
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">Malith R.</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">malith@gmail.com</p>
            </div>
          </div>

          <button
            type="button"
            title="Sign Out"
            onClick={() => navigate("/login")}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;