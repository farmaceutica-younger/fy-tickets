FROM node:16-alpine3.12 as base
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn
RUN apk add --no-cache libc6-compat

FROM base as builder
WORKDIR /app

COPY package*.json /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN npm ci 
COPY . .
ENV NODE_ENV production
RUN npx blitz prisma generate
RUN npm run build

FROM base
WORKDIR /app

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

ENV PORT 3000
EXPOSE 3000

USER pptruser

CMD [ "npm", "start" ]
