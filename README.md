# Chemical Ordering Monitoring System

A full-stack application built to monitor, manage, and order chemicals efficiently.

## Project Structure

The repository is structured into two main applications:

- **`backend/`**: An ASP.NET Core Web API that serves as the data and business logic layer for the system.
- **`frontend/`**: A React application built with Vite and TypeScript, providing an interactive user interface.

## Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download) (for the backend)
- [Node.js](https://nodejs.org/) (for the frontend)

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Restore dependencies and run the server:
   ```bash
   dotnet restore
   dotnet run
   ```
The backend API should now be running locally.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The application UI should now be available in your browser (usually at `http://localhost:5173`).

## Technologies Used

- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: C#, ASP.NET Core, Entity Framework Core (PostgreSQL)

## License
MIT
