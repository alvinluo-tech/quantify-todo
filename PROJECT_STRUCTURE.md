# 📁 TaskMaster 项目结构分析

> 生成时间: 2025-11-27
> 
> 本文档详细说明了 TaskMaster "Quantified Self" Todo List 应用的完整目录结构和文件组织方式。

---

## 🎯 项目概述

TaskMaster 是一个基于 Next.js 14 的全栈生产力应用，采用 App Router 架构，集成了：
- **前端**: React 18 + TypeScript + Tailwind CSS v4
- **后端**: Supabase (PostgreSQL + Auth + Real-time)
- **状态管理**: Zustand
- **UI 组件**: Shadcn/UI
- **数据可视化**: Recharts
- **拖拽功能**: @dnd-kit

---

## 📂 根目录结构

```
e:\code\projects\todolist\
├── 📁 app/                    # Next.js App Router 应用目录
├── 📁 components/             # React 组件库
├── 📁 lib/                    # 工具函数和库
├── 📁 supabase/              # 数据库脚本
├── 📁 types/                 # TypeScript 类型定义
├── 📁 public/                # 静态资源
├── 📁 node_modules/          # NPM 依赖包
├── 📁 .next/                 # Next.js 构建输出
├── 📁 .git/                  # Git 版本控制
│
├── 📄 middleware.ts          # Next.js 中间件（会话管理）
├── 📄 package.json           # 项目依赖配置
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 next.config.ts         # Next.js 配置
├── 📄 tailwind.config.ts     # Tailwind CSS 配置
├── 📄 postcss.config.mjs     # PostCSS 配置
├── 📄 components.json        # Shadcn/UI 配置
├── 📄 .env.local             # 环境变量（不提交）
├── 📄 .env.example           # 环境变量示例
├── 📄 .gitignore             # Git 忽略规则
│
└── 📚 文档文件
    ├── README.md             # 项目介绍
    ├── SETUP.md              # 安装指南
    ├── QUICKSTART.md         # 快速开始
    ├── DEVELOPMENT.md        # 开发指南
    ├── PRODUCTION_GUIDE.md   # 生产部署指南
    ├── PROJECT_SUMMARY.md    # 项目总结
    └── NEXT_STEPS.md         # 后续计划
```

---

## 🎨 `/app` - 应用路由目录

Next.js 14 App Router 架构，基于文件系统的路由。

```
app/
├── 📄 layout.tsx             # 根布局组件（HTML 结构）
├── 📄 page.tsx               # 首页（重定向到 /login）
├── 📄 globals.css            # 全局样式（Tailwind 导入）
├── 📄 favicon.ico            # 网站图标
│
├── 📁 login/                 # 登录/注册页面
│   └── 📄 page.tsx           # 认证 UI（邮箱/密码 + Google OAuth）
│
├── 📁 auth/                  # 认证回调处理
│   └── 📁 callback/
│       └── 📄 route.ts       # OAuth 回调路由（处理 Google 登录）
│
└── 📁 dashboard/             # 主应用仪表板（受保护路由）
    ├── 📄 layout.tsx         # Dashboard 布局（认证守卫）
    └── 📄 page.tsx           # 主应用页面（任务管理界面）
```

### 路由说明

| 路径 | 文件 | 功能 | 访问控制 |
|------|------|------|----------|
| `/` | `app/page.tsx` | 根路径重定向 | 公开 |
| `/login` | `app/login/page.tsx` | 登录/注册界面 | 公开 |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth 回调处理 | 公开 |
| `/dashboard` | `app/dashboard/page.tsx` | 任务管理主页 | 需认证 |

---

## 🧩 `/components` - 组件库

所有可复用的 React 组件，分为业务组件和 UI 基础组件。

```
components/
├── 📁 ui/                           # Shadcn/UI 基础组件（11个）
│   ├── 📄 badge.tsx                 # 标签组件
│   ├── 📄 button.tsx                # 按钮组件
│   ├── 📄 card.tsx                  # 卡片容器
│   ├── 📄 circular-progress.tsx    # 圆形进度条（自定义）
│   ├── 📄 dialog.tsx                # 对话框/弹窗
│   ├── 📄 input.tsx                 # 输入框
│   ├── 📄 label.tsx                 # 标签文本
│   ├── 📄 progress-slider.tsx      # 进度滑块（自定义）
│   ├── 📄 select.tsx                # 下拉选择器
│   ├── 📄 slider.tsx                # 滑块组件
│   └── 📄 textarea.tsx              # 多行文本框
│
├── 📄 task-list.tsx                 # 任务列表（嵌套树形结构）
├── 📄 task-item.tsx                 # 单个任务项（展开/折叠/编辑）
├── 📄 task-form-dialog.tsx          # 任务创建/编辑表单
├── 📄 todays-focus.tsx              # "今日专注" 视图（智能优先级）
├── 📄 morning-planner.tsx           # 晨间计划器（拖拽排序）
├── 📄 draggable-task-card.tsx       # 可拖拽任务卡片
├── 📄 daily-review.tsx              # 每日回顾弹窗（晚间复盘）
├── 📄 analytics-dashboard.tsx       # 分析仪表板（统计图表）
├── 📄 activity-heatmap.tsx          # 活动热力图（GitHub 风格）
└── 📄 burndown-chart.tsx            # 燃尽图（Recharts）
```

### 组件分类

**核心业务组件（10个）**
- 任务管理: `task-list`, `task-item`, `task-form-dialog`
- 专注视图: `todays-focus`, `morning-planner`, `draggable-task-card`
- 回顾分析: `daily-review`, `analytics-dashboard`
- 数据可视化: `activity-heatmap`, `burndown-chart`

**UI 基础组件（11个）**
- 全部来自 Shadcn/UI，包含 2 个自定义组件（`circular-progress`, `progress-slider`）

---

## 📚 `/lib` - 工具库

业务逻辑、状态管理、数据库客户端等核心功能。

```
lib/
├── 📁 store/                        # Zustand 状态管理
│   └── 📄 task-store.ts             # 任务全局状态（CRUD + 同步）
│
├── 📁 supabase/                     # Supabase 客户端
│   ├── 📄 client.ts                 # 客户端（浏览器端使用）
│   ├── 📄 server.ts                 # 服务端（SSR/API 路由）
│   └── 📄 middlewares.ts            # 中间件客户端（认证检查）
│
├── 📁 utils/                        # 业务工具函数
│   ├── 📄 task-scoring.ts           # 任务评分算法（智能优先级）
│   └── 📄 task-tree.ts              # 任务树操作（计算进度/查找节点）
│
└── 📄 utils.ts                      # 通用工具函数（cn 类名合并）
```

### 核心模块说明

**`lib/store/task-store.ts`**
- 使用 Zustand 管理全局任务状态
- 功能: 增删改查、本地缓存、Supabase 同步
- 关键方法: `fetchTasks`, `addTask`, `updateTask`, `deleteTask`, `toggleTask`

**`lib/supabase/`**
- `client.ts`: 浏览器端客户端（使用 `createBrowserClient`）
- `server.ts`: 服务端客户端（SSR、Server Actions）
- `middlewares.ts`: 中间件客户端（session 刷新）

**`lib/utils/`**
- `task-scoring.ts`: 智能优先级算法
  - 计算公式：`score = urgency × importance × (1 - progress) × timeWeight`
- `task-tree.ts`: 树形结构操作
  - `calculateProgress`: 递归计算任务完成度
  - `findTaskById`, `countTotalTasks`, `countCompletedTasks` 等

---

## 🗄️ `/supabase` - 数据库脚本

PostgreSQL 数据库模式和 RLS（行级安全）脚本。

```
supabase/
├── 📄 schema.sql                    # 数据库表结构定义
│   ├── tasks 表（主表）
│   │   ├── id (UUID, 主键)
│   │   ├── user_id (UUID, 外键到 auth.users)
│   │   ├── title, description
│   │   ├── parent_id (自关联，支持无限嵌套)
│   │   ├── priority, energy_level
│   │   ├── progress, status, is_completed
│   │   ├── due_date, scheduled_for
│   │   └── created_at, updated_at
│   │
│   └── task_logs 表（日志表）
│       ├── id (UUID, 主键)
│       ├── task_id (外键到 tasks)
│       ├── user_id (外键到 auth.users)
│       ├── action (状态变更)
│       └── timestamp
│
├── 📄 enable-rls-for-production.sql  # 启用 RLS（生产环境）
│   ├── ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
│   └── 策略: 用户只能访问自己的数据
│
└── 📄 disable-rls-for-testing.sql    # 禁用 RLS（开发测试）
    └── ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

### 数据库设计特点

- **无限层级嵌套**: `parent_id` 自关联设计
- **行级安全 (RLS)**: 多租户数据隔离
- **软删除**: 保留数据历史记录
- **时间戳**: 自动更新 `updated_at`

---

## 🏷️ `/types` - TypeScript 类型

全局 TypeScript 类型定义。

```
types/
└── 📄 task.ts                       # 任务相关类型
    ├── Task 接口（核心数据模型）
    ├── TaskStatus 枚举（'todo' | 'in-progress' | 'done'）
    ├── Priority 枚举（1-5 级优先级）
    └── EnergyLevel 枚举（'low' | 'medium' | 'high'）
```

### 类型定义示例

```typescript
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  parent_id?: string;
  priority: number;        // 1-5
  energy_level: string;    // 'low' | 'medium' | 'high'
  progress: number;        // 0-100
  status: TaskStatus;
  is_completed: boolean;
  due_date?: string;
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
}
```

---

## 🖼️ `/public` - 静态资源

公开访问的静态文件（图标、图片等）。

```
public/
├── 📄 file.svg
├── 📄 globe.svg
├── 📄 next.svg
├── 📄 vercel.svg
└── 📄 window.svg
```

---

## ⚙️ 配置文件

### 核心配置文件说明

| 文件 | 用途 |
|------|------|
| `package.json` | NPM 依赖管理、脚本命令 |
| `tsconfig.json` | TypeScript 编译器配置（路径别名 `@/*`） |
| `next.config.ts` | Next.js 配置（Turbopack、ESLint） |
| `tailwind.config.ts` | Tailwind CSS 自定义主题、插件 |
| `postcss.config.mjs` | PostCSS 配置（Tailwind 处理） |
| `components.json` | Shadcn/UI 组件库配置 |
| `middleware.ts` | 全局中间件（Supabase 会话刷新） |

### 环境变量（`.env.local`）

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

---

## 🔄 数据流架构

```
用户交互
  ↓
React 组件（components/）
  ↓
Zustand Store（lib/store/task-store.ts）
  ↓
Supabase Client（lib/supabase/client.ts）
  ↓
PostgreSQL 数据库（supabase/schema.sql）
  ↓
RLS 策略验证
  ↓
返回数据 → 更新 UI
```

---

## 🛡️ 认证流程

```
/login 页面
  ├── 邮箱/密码注册 → Supabase Auth → 发送验证邮件
  ├── 邮箱/密码登录 → Supabase Auth → 创建 Session
  └── Google OAuth → /auth/callback → 交换 token → 重定向到 /dashboard

/dashboard
  ↓
middleware.ts 检查 session
  ├── 有效 → 允许访问
  └── 无效 → 重定向到 /login
```

---

## 📊 功能模块映射

| 功能 | 涉及文件 |
|------|----------|
| **任务 CRUD** | `components/task-list.tsx`, `lib/store/task-store.ts` |
| **智能优先级** | `lib/utils/task-scoring.ts`, `components/todays-focus.tsx` |
| **晨间计划** | `components/morning-planner.tsx`, `components/draggable-task-card.tsx` |
| **每日回顾** | `components/daily-review.tsx` |
| **数据分析** | `components/analytics-dashboard.tsx`, `components/activity-heatmap.tsx` |
| **进度可视化** | `components/ui/circular-progress.tsx`, `components/burndown-chart.tsx` |
| **用户认证** | `app/login/page.tsx`, `app/auth/callback/route.ts`, `middleware.ts` |

---

## 🚀 开发工作流

### 本地开发
```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 凭证

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:3000
```

### 数据库设置
```bash
# 在 Supabase SQL Editor 执行
1. supabase/schema.sql           # 创建表结构
2. supabase/enable-rls-for-production.sql  # 启用安全策略
```

---

## 📦 依赖包总结

### 核心框架
- `next@14.2+` - React 框架
- `react@18`, `react-dom@18` - UI 库
- `typescript@5` - 类型系统

### UI 组件
- `@radix-ui/*` - Shadcn/UI 底层组件
- `lucide-react` - 图标库
- `tailwindcss@4` - CSS 框架

### 状态管理 & 数据
- `zustand@5.0+` - 状态管理
- `@supabase/supabase-js@2`, `@supabase/ssr@0.5+` - 数据库客户端

### 功能库
- `recharts@2.15+` - 图表可视化
- `@dnd-kit/*` - 拖拽功能
- `date-fns@4` - 日期处理

---

## 📝 项目统计

- **总组件数**: 21 个（10 个业务 + 11 个 UI）
- **路由数**: 4 个（/, /login, /auth/callback, /dashboard）
- **数据库表**: 2 个（tasks, task_logs）
- **状态管理**: 1 个全局 Store
- **工具函数**: 5 个模块
- **配置文件**: 7 个

---

## 🎯 架构优势

1. **清晰的关注点分离**
   - 路由（app/）、组件（components/）、逻辑（lib/）严格分离

2. **类型安全**
   - 全项目 TypeScript 覆盖，types/ 统一管理

3. **可扩展性**
   - 无限层级任务嵌套
   - 模块化组件设计

4. **安全性**
   - Supabase RLS 行级安全
   - 中间件会话验证

5. **开发体验**
   - Tailwind CSS v4 快速样式
   - Shadcn/UI 组件复用
   - Zustand 简洁状态管理

---

## 📚 相关文档

- **新手入门**: 阅读 `QUICKSTART.md`
- **功能详解**: 阅读 `PROJECT_SUMMARY.md`
- **部署指南**: 阅读 `PRODUCTION_GUIDE.md`
- **开发规范**: 阅读 `DEVELOPMENT.md`

---

**文档维护**: 如目录结构发生重大变更，请及时更新本文档。

