# Stage 1: Build the frontend app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the app using a lightweight HTTP server
FROM node:18-alpine

# Install a lightweight static file server
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist .

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".", "-l", "3000"]