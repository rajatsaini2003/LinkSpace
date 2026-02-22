# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src/ ./src/
COPY tsconfig.json ./
COPY prisma/ ./prisma/

RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist/ ./dist/
COPY prisma/ ./prisma/

RUN npx prisma generate

EXPOSE 3030

CMD ["node", "dist/server.js"]
