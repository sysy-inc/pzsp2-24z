# Sensors App

A simple web application that displays temperature and humidity data. The app consists of a **React frontend** and a **FastAPI backend**.

## Project Structure
    ```bash
sensors_app/
├── backend
│   ├── app.py
└── frontend
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── src
    └── vite

## Prerequisites

Make sure the following are installed on your system:

- **Python** (version 3.7 or later)
- **Node.js** (version 14 or later)
- **npm** (comes with Node.js)

## Setup Instructions

### Backend (FastAPI)

1. Navigate to the `backend` directory:
   ```bash
   cd sensors_app/backend


2. Install the required Python packages 
    ```bash
    pip install fastapi uvicorn

3. Run the FastAPI backend:
   ```bash
   uvicorn app:app --reload

4. The backend will be available at http://127.0.0.1:8000

### Frontend (React)

1. Open a new terminal and navigate to the frontend directory:
    ```bash
    cd sensors_app/frontend

2. Install the dependencies
    ```bash
    npm install
    npm install axios

3. Start the React development server:
    ```bash
    npm run dev

4. The frontend will be available at http://127.0.0.1:5173