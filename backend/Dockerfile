# Use an official Python runtime as a parent image
FROM python:3.12-slim AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set the working directory to /psi_backend
WORKDIR /backend

# Copy project files
COPY pyproject.toml pdm.lock ./

# Install PDM
RUN pip install --no-cache-dir pdm

# Copy the application code
COPY src ./src

RUN pdm install --prod --no-editable --no-lock

CMD ["pdm", "run", "start"]