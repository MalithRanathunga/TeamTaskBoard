import React, { useState, useEffect } from "react";
import { Plus, Kanban, Settings, LogOut, ChevronDown, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

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

const Sidebar = ({ activeBoard, setActiveBoard }) => {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const fetchBoards = async () => {
    try {
      const res = await API.get("/boards");
      setBoards(res.data);
      if (res.data.length > 0 && !activeBoard) {
        setActiveBoard(res.data[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load boards");
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const res = await API.post("/boards", {
        title: newBoardTitle,
        description: newBoardDesc,
      });
      setBoards((prev) => [res.data, ...prev]);
      setActiveBoard(res.data);
      toast.success("Board created!");
      setNewBoardTitle("");
      setNewBoardDesc("");
      setIsBoardModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create board");
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    if (!activeBoard) {
      toast.error("Select a board first");
      return;
    }

    try {
      const res = await API.post(`/boards/${activeBoard._id}/members`, {
        email: inviteEmail.trim(),
      });
      // Update active board and boards list
      setActiveBoard(res.data);
      setBoards((prev) =>
        prev.map((b) => (b._id === res.data._id ? res.data : b))
      );
      toast.success("Member added to board!");
      setInviteEmail("");
      setIsInviteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <aside className="w-64 sm:w-72 h-screen bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 select-none">
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

        {/* Create Board Button */}
        <button
          type="button"
          onClick={() => setIsBoardModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Board</span>
        </button>

        {/* Sections */}
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
          {/* Boards List */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Boards ({boards.length})
              </span>
            </div>
            <div className="space-y-1">
              {boards.map((board) => {
                const isActive = activeBoard?._id === board._id;
                return (
                  <button
                    key={board._id}
                    type="button"
                    onClick={() => setActiveBoard(board)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-indigo-50/80 text-indigo-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Kanban className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className="truncate">{board.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board Members */}
          {activeBoard && (
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Board Members ({activeBoard.members?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Invite</span>
                </button>
              </div>

              <div className="space-y-1">
                {activeBoard.members?.map((member, index) => {
                  const isOwner = member._id === activeBoard.owner?._id || member._id === activeBoard.owner;
                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full ${memberColors[index % memberColors.length]
                            } text-white text-[10px] font-bold flex items-center justify-center shrink-0`}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate leading-tight">
                            {member.name}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {isOwner ? "Owner" : "Member"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user?.name || "User"}</p>
              <p className="text-[10px] text-slate-400 truncate leading-tight">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <button
            type="button"
            title="Sign Out"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Create Board */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Board</h3>
              <button
                type="button"
                onClick={() => setIsBoardModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Board Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sprint 1 Workspace"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief board summary..."
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBoardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered User Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="teammate@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;