# Multi-stage build for optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S yaadein -u 1001

# Copy built node modules and source code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN npm run build

# Set proper permissions
RUN chown -R yaadein:nodejs /app

USER yaadein
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["node", "dist/index.js"]