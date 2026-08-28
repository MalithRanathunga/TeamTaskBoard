import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, ChevronRight, ChevronLeft, X, WifiOff } from "lucide-react";
import { socket } from "../services/socket";
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
  const boardId = currentBoard?._id;
  const boardMembers = currentBoard?.members || [];

  const [tasks, setTasks] = useState(() => {
    if (!boardId) return [];
    const cached = localStorage.getItem(`cached_tasks_${boardId}`);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [targetColumn, setTargetColumn] = useState("todo");

  const [newTaskTitle, setNewTaskTitle] = useState(() => {
    return localStorage.getItem("draft_task_title") || "";
  });
  const [newTaskDesc, setNewTaskDesc] = useState(() => {
    return localStorage.getItem("draft_task_desc") || "";
  });
  const [newTaskPriority, setNewTaskPriority] = useState(() => {
    return localStorage.getItem("draft_task_priority") || "medium";
  });
  const [newTaskAssignee, setNewTaskAssignee] = useState(() => {
    return localStorage.getItem("draft_task_assignee") || "";
  });
  const [dueDate, setDueDate] = useState(() => {
    return localStorage.getItem("draft_task_duedate") || "";
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Back online! Syncing data...");
      fetchTasks();
    };
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("Network lost. Operating in offline view mode.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [boardId]);

  // Persist form drafts to localStorage on change
  useEffect(() => {
    localStorage.setItem("draft_task_title", newTaskTitle);
  }, [newTaskTitle]);

  useEffect(() => {
    localStorage.setItem("draft_task_desc", newTaskDesc);
  }, [newTaskDesc]);

  useEffect(() => {
    localStorage.setItem("draft_task_priority", newTaskPriority);
  }, [newTaskPriority]);

  useEffect(() => {
    localStorage.setItem("draft_task_assignee", newTaskAssignee);
  }, [newTaskAssignee]);

  useEffect(() => {
    localStorage.setItem("draft_task_duedate", dueDate);
  }, [dueDate]);

  // Fetch tasks and update cache
  const fetchTasks = async () => {
    if (!boardId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/tasks?boardId=${boardId}`);
      setTasks(res.data);
      localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(res.data));
    } catch (error) {
      const cached = localStorage.getItem(`cached_tasks_${boardId}`);
      if (cached) {
        setTasks(JSON.parse(cached));
        toast("Loaded cached tasks from offline storage", { icon: "💾" });
      } else {
        toast.error(error.response?.data?.message || "Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem(`cached_tasks_${boardId}`);
    if (cached) {
      setTasks(JSON.parse(cached));
    }
    fetchTasks();
  }, [boardId]);

  useEffect(() => {
    if (!boardId) return;

    socket.emit("join_board", boardId);

    // Live Task Created
    const handleTaskCreated = (newTask) => {
      if (newTask.boardId === boardId) {
        setTasks((prev) => {
          if (prev.some((t) => t._id === newTask._id)) return prev;
          const updated = [newTask, ...prev];
          localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updated));
          return updated;
        });
      }
    };

    // Live Task Updated
    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask.boardId === boardId) {
        setTasks((prev) => {
          const updated = prev.map((t) => (t._id === updatedTask._id ? updatedTask : t));
          localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updated));
          return updated;
        });
      }
    };

    // Live Task Deleted
    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => {
        const updated = prev.filter((t) => t._id !== taskId);
        localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("task_created", handleTaskCreated);
    socket.on("task_updated", handleTaskUpdated);
    socket.on("task_deleted", handleTaskDeleted);

    return () => {
      socket.emit("leave_board", boardId);
      socket.off("task_created", handleTaskCreated);
      socket.off("task_updated", handleTaskUpdated);
      socket.off("task_deleted", handleTaskDeleted);
    };
  }, [boardId]);

  const clearDraft = () => {
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskPriority("medium");
    setNewTaskAssignee("");
    setDueDate("");
    localStorage.removeItem("draft_task_title");
    localStorage.removeItem("draft_task_desc");
    localStorage.removeItem("draft_task_priority");
    localStorage.removeItem("draft_task_assignee");
    localStorage.removeItem("draft_task_duedate");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (!boardId) {
      toast.error("Please select a board first");
      return;
    }

    try {
      const payload = {
        boardId,
        title: newTaskTitle,
        description: newTaskDesc,
        status: targetColumn,
        priority: newTaskPriority,
        assignee: newTaskAssignee || undefined,
        dueDate: dueDate || undefined,
      };

      const res = await API.post("/tasks", payload);
      const updatedList = [res.data, ...tasks.filter((t) => t._id !== res.data._id)];
      setTasks(updatedList);
      localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updatedList));
      toast.success("Task created!");

      clearDraft();
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
    const updatedTasks = tasks.map((t) =>
      t._id === taskId ? { ...t, status: newStatus } : t
    );

    setTasks(updatedTasks);
    localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updatedTasks));

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      toast.error("Failed to update status on server");
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      const updatedTasks = tasks.filter((t) => t._id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem(`cached_tasks_${boardId}`, JSON.stringify(updatedTasks));
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
    <div className="h-full w-full flex flex-col overflow-hidden relative">
      {/* Offline Status Warning Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-white px-4 py-1 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs shrink-0">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Displaying cached local data.</span>
        </div>
      )}

      {loading && tasks.length === 0 ? (
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

      {/* Task Creation */}
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">Task Title</label>
                  {newTaskTitle && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Draft autosaved</span>
                  )}
                </div>
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

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear Draft
                </button>

                <div className="flex items-center gap-2">
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
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;