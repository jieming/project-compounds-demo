FROM node:20-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5173

ENV BACKEND_API_PORT=8000

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
