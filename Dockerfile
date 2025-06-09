FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run build --prod

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/doc ./doc
CMD ["sh", "-c", "npm i prisma && npx prisma migrate dev && node dist/main.js"]