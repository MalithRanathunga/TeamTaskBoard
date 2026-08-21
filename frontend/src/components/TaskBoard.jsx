import React, { useState } from "react";
import { Plus, MoreVertical, Calendar, MessageSquare, Paperclip, CheckCircle2, Clock, AlertCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

// Mock task data
const initialTasks = [
  {
    id: "task-1",
    title: "Setup MongoDB Schemas & Auth API",
    description: "Define User and Board data models with mongoose and JWT middleware validation.",
    status: "todo",
    priority: "High",
    dueDate: "Aug 24",
    comments: 3,
    attachments: 1,
    assignee: { name: "Malith R.", initials: "MR", color: "bg-blue-600" }
  },
  {
    id: "task-2",
    title: "Design System Tokens in Tailwind",
    description: "Align color palette, gradients, and custom utility classes with Tailwind v4.",
    status: "todo",
    priority: "Medium",
    dueDate: "Aug 26",
    comments: 1,
    attachments: 0,
    assignee: { name: "Sarah C.", initials: "SC", color: "bg-indigo-600" }
  },
  {
    id: "task-3",
    title: "Implement Drag & Drop Interaction",
    description: "Enable smooth card movement across To Do, Doing, and Done columns.",
    status: "doing",
    priority: "High",
    dueDate: "Aug 23",
    comments: 5,
    attachments: 2,
    assignee: { name: "Alex R.", initials: "AR", color: "bg-purple-600" }
  },
  {
    id: "task-4",
    title: "Vite + React Router Scaffold",
    description: "Initial client setup with clean route configuration and layout shells.",
    status: "done",
    priority: "Low",
    dueDate: "Aug 21",
    comments: 2,
    attachments: 0,
    assignee: { name: "Malith R.", initials: "MR", color: "bg-blue-600" }
  }
];

const columns = [
  { id: "todo", title: "To Do", badgeColor: "bg-slate-100 text-slate-700", dotColor: "bg-slate-400" },
  { id: "doing", title: "Doing", badgeColor: "bg-amber-50 text-amber-700 border border-amber-200/60", dotColor: "bg-amber-500" },
  { id: "done", title: "Done", badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", dotColor: "bg-emerald-500" }
];

const priorityStyles = {
  High: "bg-rose-50 text-rose-600 border-rose-200/60",
  Medium: "bg-amber-50 text-amber-600 border-amber-200/60",
  Low: "bg-sky-50 text-sky-600 border-sky-200/60"
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumn, setTargetColumn] = useState("todo");

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");

  // Move task status forward or backward
  const moveTask = (taskId, direction) => {
    const statusOrder = ["todo", "doing", "done"];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = statusOrder.indexOf(t.status);
        const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < statusOrder.length) {
          return { ...t, status: statusOrder[nextIndex] };
        }
        return t;
      })
    );
  };

  // Add task handler
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      status: targetColumn,
      priority: newTaskPriority,
      dueDate: "Aug 28",
      comments: 0,
      attachments: 0,
      assignee: { name: "Malith R.", initials: "MR", color: "bg-blue-600" }
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setNewTaskDesc("");
    setIsModalOpen(false);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">

      {/* Board Columns Grid */}
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

              {/* Task Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <span>No tasks in this column</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group select-none"
                    >
                      {/* Priority Tag & Actions */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityStyles[task.priority]}`}
                        >
                          {task.priority}
                        </span>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {task.status !== "todo" && (
                            <button
                              type="button"
                              onClick={() => moveTask(task.id, "prev")}
                              title="Move Left"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {task.status !== "done" && (
                            <button
                              type="button"
                              onClick={() => moveTask(task.id, "next")}
                              title="Move Right"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                        {task.description}
                      </p>

                      {/* Card Footer: Metadata & Assignee */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {task.dueDate}
                          </span>
                          {task.comments > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-400" />
                              {task.comments}
                            </span>
                          )}
                        </div>

                        <div
                          title={task.assignee.name}
                          className={`w-6 h-6 rounded-full ${task.assignee.color} text-white text-[9px] font-bold flex items-center justify-center`}
                        >
                          {task.assignee.initials}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Column CTA */}
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

      {/* 2. New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-150">

            {/* Modal Header */}
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

            {/* Modal Form */}
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement user logout logic"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add details, acceptance criteria, or endpoints..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Column Status
                  </label>
                  <select
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Modal Buttons */}
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