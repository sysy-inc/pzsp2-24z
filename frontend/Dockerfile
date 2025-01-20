# Use the Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g serve && npm install

# Copy the application files
COPY . .

# Build the application
RUN npm run build

# Set the command to serve the app
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose the port
EXPOSE 3000