# Sensors App

A simple web application that displays temperature and humidity data. The app consists of a **React frontend** and a **FastAPI backend**.

## Project Structure
```bash
    ├── README.md
    └── sensors_app
        ├── app
        ├── backend
        │   ├── Dockerfile
        │   ├── __pycache__
        │   └── app.py
        ├── docker-compose.yml
        └── frontend
            ├── Dockerfile
            ├── README.md
            ├── eslint.config.js
            ├── index.html
            ├── node_modules
            ├── package-lock.json
            ├── package.json
            ├── public
            ├── src
            └── vite.config.js
```
## Prerequisites

Make sure the following are installed on your system:

- **Python** (version 3.7 or later)
- **Node.js** (version 14 or later)
- **npm** (comes with Node.js)

## Setup Instructions

### DOCKER UPDATE!
    The program is using Docker Compose version v2.3.3!
    Installation
```bash
    In directory sensons_app ->  docker compose up
    mkdir -p ~/.docker/cli-plugins/
    curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose

    chmod +x ~/.docker/cli-plugins/docker-compose
    docker compose version

    In case of docker.sock problems
    sudo groupadd docker
    sudo usermod -aG docker ${USER}
    sudo chmod 666 /var/run/docker.sock
    sudo systemctl restart docker
```
### Backend (FastAPI)

1. Navigate to the `backend` directory:
```bash
   cd sensors_app/backend
```

2. Install the required Python packages
```bash
    pip install fastapi uvicorn
```
3. Run the FastAPI backend:
```bash
   uvicorn app:app --reload
```
4. The backend will be available at http://127.0.0.1:8000

## Setting up Database for development

Create a Postgres database container
```bash
docker run --name postgres15-pzsp2-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v ./scripts:/var/scripts \
  postgres:15
```

Create tables in the database
```bash
docker exec -it postgres15-pzsp2-dev psql -U postgres -d postgres -f /var/scripts/create_database.sql
```

Seed Database
```bash
docker exec -it postgres15-pzsp2-dev psql -U postgres -d postgres -f /var/scripts/init_database.sql
```

Clear Database
```bash
docker exec -it postgres15-pzsp2-dev psql -U postgres -d postgres -f /var/scripts/clear_db.sql
```
