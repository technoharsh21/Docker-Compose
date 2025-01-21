FROM node:alpine AS dependencies

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

# Stage 2: Build application

FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm && pnpm install 

RUN pnpm run build

# Stage 3: Production-ready image

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 3000

CMD ["node", "dist/main.js"]
