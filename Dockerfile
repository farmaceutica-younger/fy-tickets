FROM node:16-alpine3.12 as builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json /app

RUN npm ci 
COPY . .
ENV NODE_ENV production
RUN npx blitz prisma generate
RUN npm run build
RUN npm prune --production

FROM node:slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

ENV PORT 3000
EXPOSE 3000

CMD [ "blitz", "start" "--production" ]
