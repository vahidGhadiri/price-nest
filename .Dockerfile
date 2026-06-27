# -------------------
# Base
# -------------------
FROM node:20-alpine AS base

WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# -------------------
# Builder
# -------------------
FROM base AS builder

WORKDIR /app
COPY . .

RUN yarn build


# -------------------
# Runner (ultra light)
# -------------------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable


COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]