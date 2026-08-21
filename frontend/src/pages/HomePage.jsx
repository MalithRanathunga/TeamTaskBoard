import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";

const HomePage = () => {
  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* 3-Column Task Board */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <TaskBoard />
        </main>
      </div>
    </div>
  );
};

export default HomePage;