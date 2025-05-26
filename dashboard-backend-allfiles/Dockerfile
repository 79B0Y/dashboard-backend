# Dockerfile – 多阶段构建（Node 18 + PM2 Runtime）
# -----------------------------------------------------------
# 构建步骤：
#   1. 使用 node:18-alpine 作为基础镜像，复制代码并安装依赖
#   2. 暴露 3001 端口，使用 pm2-runtime 启动
# -----------------------------------------------------------

# ---- 构建阶段 ----
FROM node:18-alpine AS builder
WORKDIR /app

# 安装依赖（利用缓存）
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# 复制项目源码
COPY . .

# ---- 运行阶段 ----
FROM node:18-alpine
WORKDIR /app

# 拷贝依赖 & 源码（不含 devDependencies）
COPY --from=builder /app /app

# 安装 pm2
RUN npm i -g pm2@latest

EXPOSE 3001
ENV NODE_ENV=production

CMD ["pm2-runtime", "pm2.config.js"]

# 🎉 容器启动后读取 pm2.config.js，守护 server.js 进程
