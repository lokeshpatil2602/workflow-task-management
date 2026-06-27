FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Create upload directories
RUN mkdir -p uploads/submissions uploads/chat

EXPOSE 5000

CMD ["node", "index.js"]
