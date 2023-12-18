# ----------------------------------------------------------------------------------------------------------------------
# App builder
# ----------------------------------------------------------------------------------------------------------------------
FROM node:16-alpine as builder

# In order to install git dependencies
# ------------------------------------
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY . .
RUN npx next build


# ----------------------------------------------------------------------------------------------------------------------
# Application server
# ----------------------------------------------------------------------------------------------------------------------
FROM node:16-alpine

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN touch ./public/env-config.js
RUN chown nextjs:nodejs ./public/env-config.js

USER nextjs

# Start Next server
EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node_modules/.bin/next", "start"]


