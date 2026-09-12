# TaskFlow

TaskFlow is a full-stack task management app built with React Native (CLI + TypeScript) on the frontend and Express + MongoDB on the backend. It supports user authentication, task creation and management, filtering/sorting, and a clean mobile UI.

## Features

- User registration and login
- Create, edit, complete, delete, search, and filter tasks
- Task priority, category, scheduled start time, and due date support
- Manual date/time selection in the task modal
- Task stats and summary cards
- Theme support with light/dark styling
- Centralized Axios API client with normalized error handling

## Live APK

You can download the latest APK here:

- https://drive.google.com/file/d/1t74o0V2VqhCroByqpPeOpmIV3uGgmelW/view?usp=sharing

## Tech Stack

- Frontend: React Native CLI, TypeScript, Axios, React Native DateTimePicker
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Authentication: JWT tokens

## Project Structure

```text
TaskFlow/
├── .gitignore
├── README.md
├── client/
│   ├── .gitignore
│   ├── App.tsx
│   ├── package.json
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── screens/
│   │   ├── theme/
│   │   ├── types/
│   │   └── utils/
│   └── tsconfig.json
├── server/
│   ├── .gitignore
│   ├── .env
│   ├── package.json
│   ├── README.md
│   ├── src/
│   ├── tsconfig.json
│   └── dist/
└── README.md
```

## Quick Start

### 1) Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2) Configure environment

The server already contains a local `.env` file for development. Update it if needed with your MongoDB URI and JWT settings.

```bash
cd server
# edit .env as needed
```

### 3) Start the backend

```bash
cd server
npm run dev
```

### 4) Start the client

```bash
cd client
npm start
```

Then run the app on Android:

```bash
cd client
npx react-native run-android
```

## Backend API

The API runs locally at:

- Base URL: `http://localhost:5000/api`
- Android emulator: `http://10.0.2.2:5000/api`

### Auth endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Log in and receive a JWT |

### Task endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tasks/stats` | Get task summary stats for the authenticated user |
| `GET` | `/api/tasks` | Get all tasks for the authenticated user |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get a single task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle task completion |
| `DELETE` | `/api/tasks/:id` | Delete a task |

### Example auth header

```bash
Authorization: Bearer <your-jwt-token>
```

