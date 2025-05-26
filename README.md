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

## 📁 项目结构与用途

```
dashboard-backend/
├── controllers/              # 路由控制器逻辑
│   ├── apikey.controller.js      - 创建与查询 API Key
│   ├── config.controller.js      - 获取、更新配置及聚合数据
│   └── dashboard.controller.js   - 多仪表盘的增删查改逻辑
│
├── routes/                  # 路由定义
│   ├── apikey.routes.js        - `/api/apikey` 路由绑定
│   ├── config.routes.js        - `/api/config` 路由绑定
│   └── dashboard.routes.js     - `/api/dashboard` 路由绑定
│
├── models/                  # 可选的 Mongo 模型定义
│   └── ApiKey.js               - API Key Schema（如使用 mongoose）
│
├── public/                  # 静态资源目录
├── .env                     # 环境变量（数据库、端口等）
├── server.js                # 应用入口文件
├── package.json             # 项目依赖与启动脚本
├── install.sh               # 安装与初始化脚本
├── dashboard_mongo_init.json  # 初始化数据库样例数据
├── README.md                # 本接口文档
```


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

### apikeys 集合
```json
{
  "userId": "user_123",
  "key": "uuid-xxxx",
  "createdAt": "2025-05-26T10:00:00Z"
}
```
📎 存储用户绑定的唯一 API Key。

### device_stats 集合
```json
{
  "user": "user_001",
  "device": "AC",
  "energy": 1.85,
  "ts": "2025-05-25T08:00:00Z",
  "date": "2025-05-25"
}
```
📎 每条记录为用户某设备某时段的能耗数据，供聚合卡片查询使用。

### dashboards 集合

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

### 📈 示例：展示用户 user_001 下三台空调的能耗趋势

📚 **字段含义说明（聚合字段）**

| 字段/操作符     | 说明                                                                 |
|------------------|----------------------------------------------------------------------|
| `$sum`           | 聚合阶段中用于求和（如能耗、数量等），`"$sum": "$energy"` 表示对 energy 字段求和 |
| `$device`        | 这是 `$group` 中对原始文档中字段 `device` 的引用，建议替换为 `did`（设备 ID）字段 |
| `$energy`        | 表示原始文档中的能耗值字段，单位如 kWh，用于 KPI 或趋势计算                     |
| `_id`            | 聚合后唯一键，可组合多个字段构成复合键，如 `{ "device": "$device", "date": "$date" }` |
🧠 类似操作符还有：
| 操作符    | 含义      |
| ------ | ------- |
| `$eq`  | 等于      |
| `$ne`  | 不等于     |
| `$gt`  | 大于      |
| `$lt`  | 小于      |
| `$lte` | 小于等于    |
| `$in`  | 在指定数组中  |
| `$nin` | 不在指定数组中 |

📌 示例说明：展示 3 台空调设备每日能耗的运行曲线，使用设备 ID（如 `ac001`, `ac002`, `ac003`）进行区分，不推荐使用中文名称或别名字段作为主键。

✅ 数据库中的一条示例记录应为：
```json
{
  "user": "user_001",
  "did": "ac001",              // 设备唯一标识符（Device ID）
  "type": "AC",                 // 可选，用于标记设备类型
  "energy": 1.72,
  "ts": "2025-05-25T08:00:00Z",
  "date": "2025-05-25"
}
```

📌 建议统一使用 `did` 字段作为设备唯一标识，在卡片 pipeline 中改为按 `did` 聚合。


假设用户有三台设备：`AC_1`, `AC_2`, `AC_3`，希望在一张折线图中展示它们过去 7 天每日总能耗对比：

卡片配置：
## 📥 示例：三台空调每日能耗曲线卡片（带字段说明）

```json
{
  "title": "三台空调每日能耗曲线",           // 卡片标题，用于显示在 UI 上方
  "type": "line",                           // 图表类型：折线图
  "unit": "kWh",                            // 单位显示，前端可用于格式化值
  "collection": "device_stats",             // 数据来源集合名
  "pipeline": [                              // MongoDB 聚合查询逻辑
    { "$match": {                            // 筛选阶段：筛选出目标用户与设备
      "user": "user_001",
      "device": { "$in": ["AC_1", "AC_2", "AC_3"] },  // `$in` 表示字段值在数组中
      "date": { "$gte": "2025-05-19" }                 // `$gte` 表示大于等于某日期
    }},
    { "$group": {                             // 聚合阶段：按设备与日期分组求和
      "_id": { "device": "$device", "date": "$date" },
      "value": { "$sum": "$energy" }                // 求和字段 `$sum` 代表统计能耗之和
    }},
    { "$sort": { "_id.date": 1 } }           // 排序阶段：按日期升序排列结果
  ],
  "position": { "x": 0, "y": 2 },           // 卡片在仪表盘中的起始位置（网格坐标）
  "size": { "w": 6, "h": 2 },              // 卡片大小（横跨 6 列 2 行）
  "color": "#2b7bba",                        // 主色调，可用于前端统一样式
  "tooltip": "{device} {date}: {value} kWh"   // 自定义鼠标悬浮提示内容模板
}
```

📌 建议将字段 `device` 替换为 `did`（设备 ID）以增强设备唯一性与可维护性。

📎 前端可通过 `_id.device` 归类多条折线，横轴取 `_id.date`，纵轴取 `value` 展示。
前端应：
- 以 `_id.device` 分组为每条折线
- 以 `_id.date` 显示横轴标签
- 以 `value` 作为点值显示能耗

---

📌 卡片应包含以下结构字段以规范前端渲染行为：
```json
{
  "title": "设备趋势对比",
  "type": "line",                    // 类型：kpi / line / bar / heatmap / html
  "unit": "kWh",                     // 单位，如功耗单位、次/天、% 等
  "color": "#00BFFF",                // 可选，用于强调主色调（折线颜色）
  "tooltip": "{device}: {value}kWh",  // 可选，自定义悬浮提示格式
  "collection": "device_stats",       // 数据来源集合
  "pipeline": [...],                  // 聚合管道
  "position": { "x": 0, "y": 1 },     // 布局位置
  "size": { "w": 6, "h": 2 }          // 卡片尺寸（栅格单位）
}
```
📎 建议后端只负责存储该结构，前端根据 `type` 与字段自动解析并适配图表逻辑。

📎 卡片的取数逻辑由 `collection` 和 `pipeline` 字段定义：
- `collection` 表示查询的 MongoDB 集合名（如 `device_stats`）
- `pipeline` 是标准 MongoDB 聚合管道数组，结果结构由前端渲染逻辑适配

📎 如果你希望在一个卡片中展示多个设备运行曲线或对比数据，请约定卡片结构如下：
```json
{
  "title": "多设备趋势对比",
  "type": "line",
  "collection": "device_stats",
  "pipeline": [
    { "$match": { "user": "user_001", "device": { "$in": ["AC", "Light", "Washer"] } } },
    { "$group": {
      "_id": { "device": "$device", "date": "$date" },
      "value": { "$sum": "$energy" }
    }},
    { "$sort": { "_id.date": 1 } }
  ]
}
```
📎 前端需解析 `_id.device` 为每条线的 key，`_id.date` 为横轴，`value` 为值。


📎 如果需要在**一个卡片中展示多个设备的运行曲线**（如折线图中每条线代表一个设备），可使用以下 pipeline 模式：

```json
{
  "collection": "device_stats",
  "pipeline": [
    { "$match": { "user": "user_001", "device": { "$in": ["AC", "Light", "Washer"] } } },
    { "$group": {
      "_id": { "device": "$device", "date": "$date" },
      "value": { "$sum": "$energy" }
    }},
    { "$sort": { "_id.date": 1 } }
  ]
}
```

📎 前端需根据 `_id.device` 将结果归类为多条序列：每个设备一条线。



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
