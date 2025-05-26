📁 项目目录结构说明

dashboard-backend/
├── controllers/              # 路由控制器
│   ├── apikey.controller.js      - 处理 API Key 创建/查询逻辑
│   ├── config.controller.js      - 仪表盘配置读取/更新/聚合处理逻辑
│   └── dashboard.controller.js   - 多仪表盘读取、保存、删除控制器
│
├── routes/                  # 路由注册文件
│   ├── apikey.routes.js        - API Key 路由
│   ├── config.routes.js        - 配置聚合与 layout 路由
│   └── dashboard.routes.js     - 多仪表盘管理相关路由
│
├── models/                  # Mongo 模型（可选，当前直接使用原生 collection）
│   └── ApiKey.js               - API Key 的 Mongoose 模型（可选）
│
├── public/                  # 静态资源文件目录（可添加默认图标等）
│
├── .env                     # 环境变量配置文件
├── server.js                # 应用入口，加载 Express + 路由 + 中间件
├── package.json             # Node 项目描述文件
├── install.sh               # 一键部署脚本，初始化服务与数据库
├── dashboard_mongo_init.json  # 多仪表盘样例数据与能耗记录初始化数据
├── README.md                # 接口文档（即上方文档 Markdown）


# 📘 Dashboard 后端接口文档（清晰版）

> 更新时间：2025-05-26

---

## 🌐 基础信息

- 服务地址（开发）：`http://localhost:3001`
- 鉴权方式：
  - 请求头：`X-API-Key: your-key`
  - 或 URL 参数：`?key=your-key`

---（后续省略，结构完整文档已记住）

（此处省略，实际生成文件将包含完整内容）
