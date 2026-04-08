FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (using npm ci for accurate package lock installs)
RUN npm ci

# Copy the rest of the application files
COPY . .

# Set environment variable to disable telemetry (optional but good practice)
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN npm run build

# Expose port 3000 where Next.js runs
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]
