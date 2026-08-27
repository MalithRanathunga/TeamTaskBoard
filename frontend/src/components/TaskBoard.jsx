import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, ChevronRight, ChevronLeft, X, User } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";

const columns = [
  { id: "todo", title: "To Do", badgeColor: "bg-slate-100 text-slate-700", dotColor: "bg-slate-400" },
  { id: "in-progress", title: "In Progress", badgeColor: "bg-amber-50 text-amber-700 border border-amber-200/60", dotColor: "bg-amber-500" },
  { id: "done", title: "Done", badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", dotColor: "bg-emerald-500" },
];

const priorityStyles = {
  high: "bg-rose-50 text-rose-600 border-rose-200/60",
  medium: "bg-amber-50 text-amber-600 border-amber-200/60",
  low: "bg-sky-50 text-sky-600 border-sky-200/60",
};

const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const TaskBoard = ({ currentBoard, isModalOpen, setIsModalOpen }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetColumn, setTargetColumn] = useState("todo");

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");

  const boardId = currentBoard?._id;
  const boardMembers = currentBoard?.members || [];

  const fetchTasks = async () => {
    if (!boardId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/tasks?boardId=${boardId}`);
      setTasks(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!boardId) {
      toast.error("Please create or select a board first");
      return;
    }

    try {
      const payload = {
        boardId: boardId,
        title: newTaskTitle,
        description: newTaskDesc,
        status: targetColumn,
        priority: newTaskPriority,
        assignee: newTaskAssignee || undefined,
        dueDate: dueDate || undefined,
      };

      const res = await API.post("/tasks", payload);
      setTasks((prev) => [res.data, ...prev]);
      toast.success("Task created!");

      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskAssignee("");
      setDueDate("");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    }
  };

  const moveTask = async (taskId, direction) => {
    const statusOrder = ["todo", "in-progress", "done"];
    const target = tasks.find((t) => t._id === taskId);
    if (!target) return;

    const currentIndex = statusOrder.indexOf(target.status);
    const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0 || nextIndex >= statusOrder.length) return;

    const newStatus = statusOrder[nextIndex];

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      toast.error("Failed to update status");
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  if (!boardId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
        <p className="text-sm font-semibold">No board selected.</p>
        <p className="text-xs">Create or select a board from the sidebar to view tasks.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <span className="loading loading-spinner text-indigo-600"></span>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5 p-6 overflow-y-auto">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col bg-slate-100/70 rounded-2xl p-4 border border-slate-200/70 max-h-full"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                      {col.title}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.badgeColor}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetColumn(col.id);
                      setIsModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Add Task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Task Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                      <span>No tasks in this column</span>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group select-none"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${priorityStyles[task.priority] || priorityStyles.medium
                              }`}
                          >
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {task.status !== "todo" && (
                              <button
                                type="button"
                                onClick={() => moveTask(task._id, "prev")}
                                title="Move Left"
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {task.status !== "done" && (
                              <button
                                type="button"
                                onClick={() => moveTask(task._id, "next")}
                                title="Move Right"
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task._id)}
                              title="Delete Task"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                          </span>

                          {/* Real Assignee Badge */}
                          {task.assignee ? (
                            <div
                              title={`Assigned to ${task.assignee.name}`}
                              className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center"
                            >
                              {getInitials(task.assignee.name)}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTargetColumn(col.id);
                    setIsModalOpen(true);
                  }}
                  className="mt-3 w-full py-2 border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-xl text-xs font-semibold text-slate-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 text-lg font-bold">✱</span>
                <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement WebSocket synchronization"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Add task details, acceptance criteria..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Column Status</label>
                  <select
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Assignee Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignee</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="">Unassigned</option>
                  {boardMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;