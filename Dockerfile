FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml (if using pnpm)
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

CMD ["pnpm",  "start:dev"]

