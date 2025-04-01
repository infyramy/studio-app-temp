FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Production image
FROM node:18-alpine AS production

# Install pm2 globally
RUN npm install pm2 -g

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/.output ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.env ./

# Expose the port
EXPOSE 3000

# Set the environment variable for the port (default to 3000)
ENV PORT=3000
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Command to run the application
CMD ["pm2-runtime", "start", "node", "--", "server/index.mjs"]
