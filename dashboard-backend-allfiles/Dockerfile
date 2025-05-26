
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci
EXPOSE 3001
CMD ["pm2-runtime", "pm2.config.js"]
