import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";

const HomePage = () => {
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [activeBoardTitle, setActiveBoardTitle] = useState("");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        setActiveBoardTitle={setActiveBoardTitle}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full overflow-hidden">
        {/* Navbar */}
        <Navbar
          boardTitle={activeBoardTitle}
          onAddTaskClick={() => setIsTaskModalOpen(true)}
        />

        {/* Task Board */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <TaskBoard
            currentBoardId={activeBoardId}
            isModalOpen={isTaskModalOpen}
            setIsModalOpen={setIsTaskModalOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default HomePage;