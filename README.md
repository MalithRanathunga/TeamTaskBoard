# SyncBoard - Collaborative Task Management Application

SyncBoard is a full-stack real-time collaborative Kanban board built using the MERN stack (MongoDB, Express.js, React, Node.js). It enables agile teams to manage sprints, organize tasks across multiple workflow columns (To Do, In Progress, Done), and collaborate with multi-client real-time synchronization.

---

## Key Features

- **User Authentication**: Secure JWT-based registration and login with bcrypt password hashing.
- **Kanban Board Workspaces**: Create, manage, and collaborate on boards with multi-member workspaces.
- **Task Management**: Real-time CRUD operations for task creation, column status progression, priority tagging, and assignee assignment.
- **Live Sync Engine**: Real-time board state updates powered by Socket.io WebSockets.
- **Interactive API Documentation**: Fully documented OpenAPI 3.0 endpoints available via Swagger UI.
- **Testing & DevOps**: Comprehensive backend tests (Jest/Supertest), frontend tests (Vitest), automated GitHub Actions CI, and Docker containerization.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, DaisyUI, Socket.io-client, React Router
- **Backend**: Node.js, Express.js, Socket.io, Mongoose, Swagger UI
- **Database**: MongoDB Atlas (M0 Sandbox Free Tier Replica Set)
- **Testing**: Jest, Supertest, Vitest, React Testing Library
- **DevOps**: Docker, Docker Compose, GitHub Actions CI

---

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Git**: Installed on your local machine
- **Docker & Docker Compose** *(Optional, for containerized run)*

---

## Getting Started & Local Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/MalithRanathunga/TeamTaskBoard.git](https://github.com/MalithRanathunga/TeamTaskBoard.git)
cd TeamTaskBoard