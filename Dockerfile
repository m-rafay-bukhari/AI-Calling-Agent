# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json ./

# Install ALL deps (including devDependencies like nodemon, in case they're
# needed by any build step). We prune dev deps in the final stage.
RUN npm ci

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling (graceful shutdown)
RUN apk add --no-cache dumb-init

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY package.json package-lock.json ./
COPY server.js seeder.js ./
COPY AI_calling_agent_complete/ ./AI_calling_agent_complete/

# Create the uploads directory (multer writes here at runtime)
RUN mkdir -p AI_calling_agent_complete/public/uploads && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose the app port
EXPOSE 3000

# Environment defaults (override at runtime via --env-file or -e flags)
ENV NODE_ENV=production \
    PORT=3000

# Use dumb-init as PID 1 so SIGTERM is forwarded correctly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
