# Multi-stage build for NestJS (Node.js 22)

# 1) Dependencies + build stage
FROM node:22-slim AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# 2) Runtime stage
FROM node:22-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy only what's needed at runtime
COPY package*.json ./
# We need dev deps (ts-node, tsconfig-paths) for migration:run used in start:prod
COPY --from=builder /app/node_modules ./node_modules

# Compiled app
COPY --from=builder /app/dist ./dist

# TS sources and configs are required because migrations run via ts-node against src/data-source.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /app/nest-cli.json ./nest-cli.json

# Expose Nest default port
EXPOSE 4000

# Default command runs build+migrations+app (see package.json start:prod)
CMD ["npm", "run", "migration:generate"]
CMD ["npm", "run", "migration:run"]
CMD ["npm", "run", "start:prod"]
