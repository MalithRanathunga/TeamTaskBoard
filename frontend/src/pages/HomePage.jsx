import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";

const HomePage = () => {
  const [activeBoard, setActiveBoard] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeBoard={activeBoard}
        setActiveBoard={setActiveBoard}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full overflow-hidden">
        {/* Navbar */}
        <Navbar
          activeBoard={activeBoard}
          onAddTaskClick={() => setIsTaskModalOpen(true)}
        />

        {/* Task Board */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <TaskBoard
            currentBoard={activeBoard}
            isModalOpen={isTaskModalOpen}
            setIsModalOpen={setIsTaskModalOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;