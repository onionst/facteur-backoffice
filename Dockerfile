# ----------------------------------------------------------------------------------------------------------------------
# App builder
# ----------------------------------------------------------------------------------------------------------------------
FROM --platform=linux/amd64 node:18-alpine as builder

# In order to install git dependencies
# ------------------------------------
RUN apk update
RUN apk add --no-cache bash git openssh

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . .
RUN npm run build


# ----------------------------------------------------------------------------------------------------------------------
# Application server
# ----------------------------------------------------------------------------------------------------------------------
FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

# Start Next server
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]


