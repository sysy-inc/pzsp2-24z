# backend

### Build and run the backend and the database

```bash
docker-compose up backend db --build -d
```

### Test

##### Check status

```bash
curl -X GET http://localhost:8000/api/health
```

##### Check database

```bash
curl -X GET http://localhost:8000/api/test_db
```

##### Initialize test data

```bash
curl -X GET http://localhost:8000/api/initialize_users
```

##### Reset database

```bash
docker-compose down
docker volume rm backend_postgres_data
docker-compose up -d
```
