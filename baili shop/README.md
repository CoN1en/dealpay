# 金币系统项目

基于 Vue 3 + Supabase 的用户登录注册、签到、金币管理系统

## 技术栈
- 前端：Vue 3 + Vite + Tailwind CSS
- 后端：Supabase (PostgreSQL + Auth)
- 部署：Vercel

## 功能特性
- 用户注册/登录
- 每日签到获得金币
- 金币余额管理
- 金币消费功能
- 交易记录

## 快速开始

### 1. 配置 Supabase

1. 访问 [Supabase](https://supabase.com/) 注册账号
2. 创建新项目，获取 API 密钥和 URL
3. 在项目中创建以下数据库表：

#### `users` 表
- 由 Supabase Auth 自动创建，需添加 `coins` 字段（类型：integer，默认值：0）

#### `checkins` 表
- `id` (primary key, auto increment)
- `user_id` (foreign key to users.id)
- `checkin_date` (date)
- `coins_earned` (integer)
- `created_at` (timestamp, default: now())

#### `transactions` 表
- `id` (primary key, auto increment)
- `user_id` (foreign key to users.id)
- `type` (text, 'earn' or 'spend')
- `amount` (integer)
- `description` (text)
- `created_at` (timestamp, default: now())

#### `products` 表
- `id` (primary key, auto increment)
- `name` (varchar(100), not null)
- `price` (integer, not null)
- `description` (text, not null)
- `created_at` (timestamp, default: now())

### 2. 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
# 创建 .env.local 文件，填入：
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 启动开发服务器
npm run dev
```

### 3. 添加初始商品数据

在 Supabase 控制台执行以下 SQL 语句添加初始商品：

```sql
-- 添加示例商品
INSERT INTO products (name, price, description) VALUES 
('魔法药水', 50, '恢复体力的魔法药水'),
('幸运符', 100, '增加好运的幸运符'),
('经验书', 200, '提升经验值的书籍');
```

### 4. 部署到 Vercel

1. 登录 [Vercel](https://vercel.com/)
2. 导入 GitHub 仓库
3. 设置环境变量（与 .env.local 相同）
4. 点击 "Deploy"

## 项目结构

```
.
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   │   ├── Auth.vue
│   │   ├── Checkin.vue
│   │   ├── CoinsManagement.vue
│   │   └── Navbar.vue
│   ├── composables/
│   │   ├── useAuth.js
│   │   ├── useCheckin.js
│   │   └── useCoins.js
│   └── lib/
│       └── supabase.js
└── .env.local.example
```
