# SyncBoard — Collaborative Task Management Application

**SyncBoard** is a full-stack, real-time collaborative Kanban board built using the **MERN stack** (MongoDB, Express.js, React, and Node.js).

It enables agile teams to manage sprints, organize tasks across multiple workflow columns, and collaborate in real time across multiple clients.

---

## 🚀 Key Features

* **User Authentication**

  * Secure JWT-based registration and login
  * Password hashing using bcrypt

* **Kanban Board Workspaces**

  * Create and manage multiple boards
  * Multi-member workspaces
  * Collaborate with team members

* **Task Management**

  * Create, update, and delete tasks
  * Move tasks between workflow columns
  * Assign task priorities
  * Assign tasks to workspace members

* **Real-Time Collaboration**

  * Real-time board synchronization
  * WebSocket communication powered by Socket.io
  * Changes are reflected across connected clients

* **Interactive API Documentation**

  * OpenAPI 3.0 API specification
  * Interactive Swagger UI documentation

* **Testing & DevOps**

  * Backend testing with Jest and Supertest
  * Frontend testing with Vitest and React Testing Library
  * Automated CI using GitHub Actions
  * Docker and Docker Compose support

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* DaisyUI
* React Router
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io
* Mongoose
* Swagger UI

### Database

* MongoDB Atlas
* M0 Sandbox Free Tier
* MongoDB Replica Set

### Testing

* Jest
* Supertest
* Vitest
* React Testing Library

### DevOps

* Docker
* Docker Compose
* GitHub Actions

---

## 📋 Prerequisites

Before running SyncBoard, make sure the following are installed on your system:

| Requirement    | Version             |
| -------------- | ------------------- |
| Node.js        | `v18.0.0` or higher |
| npm            | `v9.0.0` or higher  |
| Git            | Latest recommended  |
| Docker         | Optional            |
| Docker Compose | Optional            |

> **Note:** Docker and Docker Compose are only required if you want to run the application using containers.

---

## ⚙️ Getting Started

### 1. Clone the Repository

Clone the repository from GitHub:

```bash
git clone https://github.com/MalithRanathunga/TeamTaskBoard.git
```

Navigate into the project directory:

```bash
cd TeamTaskBoard
```

---

### 2. Configure Environment Variables

SyncBoard requires environment variables for the backend and frontend.

### Backend Environment Variables

Create a `.env` file inside the `backend` directory:

```text
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.y9rxteq.mongodb.net/CollabBoard?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

### Frontend Environment Variables

Create a `.env` file inside the `frontend` directory:

```text
VITE_API_BASE_URL=http://localhost:5001/api
```

> **Security:** Never commit your `.env` files or expose your MongoDB password and JWT secret publicly.

---

## ▶️ How to Run

SyncBoard can be run in two different ways.

## Method 1 — Local Development

The frontend and backend are started separately in two terminals.

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

Once the backend is running, the API will be available at:

**API Server:**
`http://localhost:5001`

**Swagger API Documentation:**
`http://localhost:5001/api-docs`

---

### Step 2: Start the Frontend

Open a **new terminal window** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at:

`http://localhost:5173`

---

## Method 2 — Docker Compose

If Docker is installed, you can run the application using Docker Compose.

### Build and Start the Application

```bash
docker compose up --build
```

### Stop the Containers

```bash
docker compose down
```

Docker Compose will build and start the required application services.

- **Frontend App**: `http://localhost:5173` (or `http://localhost:80` depending on your Dockerfile setup)
- **Backend API**: `http://localhost:5001`
- **Swagger Docs**: `http://localhost:5001/api-docs`

---

## 🧪 Running Tests

SyncBoard includes automated tests for both the backend and frontend.

## Backend Tests

Backend integration tests use **Jest** and **Supertest**.

```bash
cd backend
npm test
```

---

## Frontend Tests

Frontend component tests use **Vitest** and **React Testing Library**.

```bash
cd frontend
npm test
```

---

## 📚 API Documentation

SyncBoard provides interactive API documentation using **Swagger UI** and the **OpenAPI 3.0** specification.

Start the backend server and navigate to:

`http://localhost:5001/api-docs`

From Swagger UI, you can explore and test the available API endpoints.

---

## 👥 Project Contributors

| Member Name          | Student ID | Designated Role                      | Core Responsibilities                                                                                                               |
| -------------------- | ---------: | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **RGMK Ranathunga**  |      35218 | Project Lead, Full-Stack & DevOps    | React/Vite scaffolding, dashboard layout, JWT authentication, WebSocket live synchronization, CI/CD pipeline, and Docker deployment |
| **IWGHN Wadiyagoda** |      35175 | Full-Stack Developer (Boards & UI)   | Task card UI components, badges, board REST API routes, CRUD logic, and workspace membership management                             |
| **SASC Yasas**       |      35260 | Full-Stack Developer (Tasks & UI)    | Kanban board column structures (To Do, In Progress, Done), task REST routes, column movement, and task deletion                     |
| **MKDNA Swarnamali** |      34653 | Frontend Developer & Backend (Users) | Landing page UI, topbar navigation, user REST endpoints, and member search controller logic                                         |
| **MAD Sandeepa**     |      35426 | Database Designer & UI/UX Developer  | Tailwind CSS design system, authentication UI (Sign In/Sign Up), and MongoDB Mongoose schema design with validations                |

---

## 🔄 Application Workflow

```text
                    ┌──────────────────┐
                    │      Client      │
                    │  React + Vite    │
                    └────────┬─────────┘
                             │
                             │ REST API
                             │ WebSocket
                             ▼
                    ┌──────────────────┐
                    │     Backend      │
                    │ Node + Express   │
                    │    + Socket.io   │
                    └────────┬─────────┘
                             │
                             │ Mongoose
                             ▼
                    ┌──────────────────┐
                    │  MongoDB Atlas   │
                    └──────────────────┘
```

---

## 🔐 Security

SyncBoard uses several security mechanisms to protect user accounts and application data:

* JWT-based authentication
* bcrypt password hashing
* Environment variables for sensitive configuration
* Protected API endpoints
* Workspace membership controls

> **Important:** Do not upload `.env` files containing database credentials, passwords, or JWT secrets to GitHub.

---

## 📌 Project Summary

SyncBoard demonstrates the development of a modern full-stack collaborative application using the **MERN stack**, with additional technologies for real-time communication, API documentation, testing, CI/CD, and containerization.

### Main Technologies
* **Frontend**: React + Vite, Tailwind CSS, DaisyUI
* **Backend**: Node.js + Express.js
* **Database**: MongoDB Atlas + Mongoose
* **Live Engine**: Socket.io
* **Authentication**: JWT + bcrypt
* **Documentation**: Swagger / OpenAPI 3.0
* **Testing**: Jest + Supertest + Vitest
* **DevOps**: Docker + GitHub Actions CI

---

## 📄 License

This project was developed as a collaborative academic project.
