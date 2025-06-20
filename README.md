# Exam Portal

An advanced online examination platform built with Next.js for the frontend and a Node.js/Express backend, featuring role-based access control for administrators and students. The backend is powered by Supabase for database and authentication services.

## ✨ Features

- **User Authentication**: Secure user signup and login for admins and students.
- **Role-Based Access Control**: Separate dashboards and functionalities for administrators and students.
- **Exam Management (Admin)**: Create, view, update, and delete exams.
- **Question Management (Admin)**: Add and manage questions for each exam.
- **Student Dashboard**: View available exams and past results.
- **Secure Testing Environment**: Students can take exams with timed submissions.
- **Automated Grading**: Instant results and performance analytics upon submission.
- **Responsive UI**: Built with Shadcn/UI and Tailwind CSS for a modern and accessible user experience.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens) & bcrypt for password hashing.
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
- [pnpm](https://pnpm.io/installation) (or you can use `npm` or `yarn`)
- A [Supabase](https://supabase.com/) account to set up the database.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Anubhav7070/exam-portal-final.git
cd exam-portal-final
```

### 2. Set Up the Backend

The backend server connects to Supabase and handles all the API logic.

```bash
cd exam-portal-backend
pnpm install
```

#### Create the `.env` file

You'll need to create a `.env` file in the `exam-portal-backend` directory. You can create a new file named `.env` and add the following content:

```env
# Supabase Credentials
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_ANON_KEY

# JWT Secret for token signing
JWT_SECRET=your_strong_jwt_secret

# Server Port
PORT=5000
```

Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project credentials. You can find these in your Supabase project dashboard under `Project Settings > API`.

### 3. Set Up the Supabase Database

The database schema and initial security policies need to be set up in your Supabase project.

1.  Navigate to your Supabase project dashboard.
2.  Go to the **SQL Editor** from the left sidebar.
3.  Open the `exam-portal-backend/setup-database.sql` file from this repository.
4.  Copy its entire content, paste it into the SQL editor, and click **RUN**.

This will create all the necessary tables (`users`, `exams`, etc.) and apply the required Row Level Security (RLS) policies.

### 4. Set Up the Frontend

The frontend is a Next.js application.

```bash
cd .. 
pnpm install
```

### 5. Running the Application

You need to run both the backend and frontend servers simultaneously.

#### Start the Backend Server

```bash
cd exam-portal-backend
pnpm start 
```
The backend will be running on `http://localhost:5000` (or the port you specified in `.env`).

#### Start the Frontend Server

In a **new terminal**, run:

```bash
pnpm dev
```
The frontend application will be available at `http://localhost:3000`.

You should now be able to access the application in your browser, create a new user, and log in.

## ⚙️ Available Scripts

### Backend (`exam-portal-backend`)

- `pnpm start`: Starts the backend server using `node app.js`.
- `pnpm dev`: Starts the backend server in development mode with `nodemon`.
- `pnpm test:env`: Checks if the environment variables are loaded correctly from the `.env` file.
- `pnpm test:connection`: Tests the connection to the Supabase database.
- `pnpm test:db`: Runs a more detailed database check.

### Frontend

- `pnpm dev`: Starts the Next.js development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts a production server.
- `pnpm lint`: Runs ESLint for code analysis.

## 📂 Project Structure

```
exam-portal/
├── app/                  # Frontend: Next.js 13 App Router pages
├── components/           # Frontend: Shared React components
├── exam-portal-backend/
│   ├── controllers/      # Backend: API logic (signup, login, etc.)
│   ├── db/               # Backend: Supabase client setup
│   ├── middleware/       # Backend: Express middleware
│   ├── routes/           # Backend: API route definitions
│   ├── app.js            # Backend: Main Express server file
│   └── setup-database.sql # SQL script for DB schema
├── hooks/                # Frontend: Custom React hooks
├── lib/                  # Frontend: Helper functions and utilities
├── public/               # Frontend: Static assets
└── ...
``` 