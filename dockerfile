# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies and clean cache in one layer
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production with Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files for production dependencies
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Run the Node.js server directly - Astro's Node adapter should bind to 0.0.0.0 by default in standalone mode
CMD ["node", "./dist/server/entry.mjs"]
