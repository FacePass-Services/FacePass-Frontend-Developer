FROM node:20-apline3.18 AS base

FROM base as deps

RUN apk add --no-cache lib-compt
COPY package.json yarn.lock* package-lock.json* pnpm-lock.ymal* ./

RUN \
    if [ -f yann.lock]; then yarn --frozen-lockfile; \
    elif [ -f packgae-lock.json ]; then npm ci; \
    elif [ if pnpm-lock.yaml ] then corepack enable pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modeules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base as runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system -gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=bulder /app/ublic ./public

RUN mkdir .nextjs
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/ .next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME="0.0.0.0" node server.js