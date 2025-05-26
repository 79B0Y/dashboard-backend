# 📘 Dashboard Backend 安装与接口调试说明

更新时间：2025-05-26

---

## 🚀 快速安装部署

### 环境依赖

* Node.js 18+
* Docker (用于运行 MongoDB)

### 一键部署步骤

```bash
# 解压项目压缩包
unzip dashboard-backend-with-install.zip
cd dashboard-backend

# 可选：赋予执行权限
chmod +x install.sh

# 执行安装脚本
./install.sh
```

该脚本将自动执行以下操作：

* 安装 Node 依赖（`npm install`）
* 自动复制 `.env.example` 为 `.env`
* 启动本地 MongoDB 容器（如未运行）
* 启动后端服务（默认端口：3001）

---

## 🔧 手动运行（开发模式）

```bash
# 启动 Mongo 容器
MONGO_PORT=27017 docker run -d \
  --name dashboard-mongo \
  -p 27017:27017 \
  -v dashboard_mongo_data:/data/db \
  mongo:6

# 安装依赖
npm install

# 启动服务
npm start
```

访问接口：`http://localhost:3001`

---

## 🔐 API Key 授权说明

所有 API 请求都必须带上合法的 `API Key`，支持以下两种方式之一：

* 请求头：`X-API-Key: your-api-key`
* URL 参数：`?key=your-api-key`

---
# 📘 Dashboard 后端接口文档（清晰版）

> 更新时间：2025-05-26

---

## 🌐 基础信息

- 服务地址（开发）：`http://localhost:3001`
- 鉴权方式：
  - 请求头：`X-API-Key: your-key`
  - 或 URL 参数：`?key=your-key`

---

## 📑 接口列表

| 方法  | 路径                      | 描述                                | 鉴权 |
|-------|---------------------------|-------------------------------------|------|
| POST  | `/api/apikey`            | 创建 API Key（通过 userId）         | 否   |
| GET   | `/api/apikey`            | 查询用户是否已有 API Key            | 否   |
| GET   | `/api/config`            | 获取默认仪表盘配置                  | 是   |
| PUT   | `/api/config`            | 更新默认仪表盘配置                  | 是   |
| POST  | `/api/config/agg`        | 查询某个卡片的聚合数据              | 是   |
| GET   | `/api/dashboard/list`    | 获取用户所有仪表盘简要信息列表      | 是   |
| GET   | `/api/dashboard/:id`     | 获取某个仪表盘详情（layout 等）     | 是   |
| PUT   | `/api/dashboard/:id`     | 修改或创建某个仪表盘                | 是   |
| DELETE| `/api/dashboard/:id`     | 删除某个仪表盘                      | 是   |

---

## 🧩 MongoDB 集合结构

### dashboards 集合
```json
{
  "userId": "user_001",
  "dashboardId": "default",
  "name": "能耗概览",
  "icon": "https://cdn.site/icon/energy.png",
  "layout": {
    "cards": [
      {
        "title": "日用电趋势",
        "type": "line",
        "collection": "device_stats",
        "pipeline": [...],
        "position": { "x": 0, "y": 1 },
        "size": { "w": 6, "h": 2 }
      }
    ]
  },
  "createdAt": "2025-05-26T10:00:00Z",
  "updatedAt": "2025-05-26T10:30:00Z"
}
```

---

## 📥 接口示例与说明

### 🔐 创建 API Key

**POST** `/api/apikey`
```json
{
  "userId": "user_123"
}
```
返回：
```json
{ "key": "xxx-xxx-uuid" }
```

---

### 🔍 查询 API Key

**GET** `/api/apikey?userId=user_123`
返回（存在）：
```json
{ "key": "xxx-xxx-uuid" }
```
返回（未绑定）：
```json
{ "error": "API key not found for this user" }
```
📎 不需要鉴权，前端可判断是否已绑定。

---

### 📥 获取仪表盘配置

**GET** `/api/config?key=xxx`
返回：
```json
{
  "userId": "user_123",
  "layout": {
    "cards": [ { "title": "...", ... } ]
  },
  "versions": [...]
}
```

---

### 📤 更新仪表盘配置

**PUT** `/api/config?key=xxx`
```json
{
  "layout": {
    "cards": [
      {
        "title": "KPI 示例",
        "type": "kpi",
        "pipeline": [...],
        "position": { "x": 0, "y": 0 },
        "size": { "w": 2, "h": 1 }
      }
    ]
  }
}
```
返回：
```json
{ "ok": true, "config": { ...updated... } }
```

---

### 📊 聚合查询卡片数据

**POST** `/api/config/agg?key=xxx`
```json
{
  "collection": "device_stats",
  "pipeline": [
    { "$match": { "device": "AC" } },
    { "$group": { "_id": null, "total": { "$sum": "$energy" } } }
  ]
}
```
返回：
```json
{ "value": { "total": 285.7 } }
```

---

### 📋 获取仪表盘列表

**GET** `/api/dashboard/list?key=xxx`
返回：
```json
[
  {
    "dashboardId": "default",
    "name": "能耗概览",
    "icon": "https://cdn.site/icon1.png",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### 📄 获取仪表盘详情

**GET** `/api/dashboard/:id?key=xxx`
返回：
```json
{
  "dashboardId": "floor2",
  "layout": { "cards": [ ... ] },
  "name": "楼层2分析",
  "icon": "..."
}
```

---

### ✏️ 更新仪表盘

**PUT** `/api/dashboard/:id?key=xxx`
```json
{
  "name": "能耗日报",
  "icon": "https://cdn.site/newicon.png",
  "layout": { "cards": [ ... ] }
}
```
返回：
```json
{
  "dashboardId": "floor2",
  "updatedAt": "...",
  "layout": { "cards": [...] }
}
```

---

### ❌ 删除仪表盘

**DELETE** `/api/dashboard/:id?key=xxx`
返回：
```json
{ "ok": true }
```




