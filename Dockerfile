# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Expose the port your app runs on (change if different)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
