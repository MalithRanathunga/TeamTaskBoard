import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

describe("Frontend Component Tests", () => {
  it("renders Login page form inputs and submit button", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders Sign Up page with full name, email, and password fields", () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@company.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("renders Navbar with active board title and live sync badge", () => {
    const mockBoard = { title: "Sprint Testing Board", members: [] };
    render(
      <Navbar activeBoard={mockBoard} onAddTaskClick={() => { }} />
    );

    expect(screen.getByText("Sprint Testing Board")).toBeInTheDocument();
    expect(screen.getByText("Live Sync")).toBeInTheDocument();
  });
});