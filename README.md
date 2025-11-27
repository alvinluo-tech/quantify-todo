# Quantified Self Todo List 🚀

[English](#english) | [中文](#chinese)

<a id="english"></a>

A modern productivity application built with Next.js 16 that focuses on **quantifiable progress** rather than just task completion. Features smart prioritization, nested task hierarchies, and visual analytics.

## Philosophy: Progress > Completion

This app focuses on **quantifiable progress** rather than just checking boxes. It helps you:
- Break down large projects into actionable subtasks
- Track actual progress on ongoing work
- Make smart decisions about what to work on next
- Visualize your productivity patterns

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **State Management:** Zustand (UI State) + Server Actions (Data)
- **Database:** Supabase (PostgreSQL + Auth)
- **Visualization:** Recharts
- **Drag & Drop:** @dnd-kit/core
- **Optimistic Updates:** React 19 useOptimistic Hook

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   - Go to your Supabase project
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the query

3. Get your API credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` and `anon/public` key

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Install & Run

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alvinluo-tech/quantify-todo)

### Manual Deploy

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

### Important Notes

- ✅ **No additional configuration needed** - Next.js App Router works out-of-the-box on Vercel
- ✅ **Automatic HTTPS** - Vercel provides SSL certificates
- ✅ **Edge Functions** - Server Actions run on Vercel Edge Network
- ✅ **Preview Deployments** - Every git push gets a preview URL
- ⚠️ **Environment Variables** - Must be set in Vercel dashboard (not in `.env.local`)
- ⚠️ **Supabase RLS** - Ensure Row Level Security policies are properly configured

## ✨ Core Features

### 📋 Nested Task Hierarchy
- **Unlimited nesting** - Create projects with unlimited subtasks
- **Auto-calculated progress** - Parent tasks automatically calculate progress from children
- **Manual tracking** - Leaf tasks use manual progress sliders (0-100%)
- **Instant updates** - Optimistic UI with React 19 useOptimistic

### 🎯 Today's Focus
Smart prioritization algorithm based on:
- **Deadline urgency** - Overdue tasks get highest priority
- **Priority levels** - P1-P5 (Low to Critical)
- **Task age** - Stagnant tasks get boosted
- **Progress status** - In-progress tasks prioritized
- **Quick filters** - "< 30min", "High Focus", "Low Energy"

### 🌅 Morning Planner
- **Drag-and-drop interface** - Visual task planning
- **Cross-container dragging** - Move tasks between backlog and today
- **Auto-scheduling** - Sets start_date automatically
- **Smart triggers** - Auto-opens 6-10 AM on first login
- **Manual access** - Available anytime via header button

### 🌙 Daily Review
- **End-of-day summary** - Auto-popup after 6 PM
- **Progress tracking** - Shows completed tasks and time logged
- **Task migration** - Move unfinished tasks to tomorrow
- **Archive management** - Clean up completed work

### 📊 Analytics Dashboard
- **Activity heatmap** - GitHub-style contribution view (30 days)
- **Burndown charts** - Track project completion trends
- **Productivity insights** - Visualize work patterns
- **Task distribution** - See priority and status breakdowns

### 🚀 Modern Architecture
- **Server Actions** - Type-safe data mutations
- **Optimistic Updates** - Instant UI feedback
- **Global UI State** - Zustand for modals, filters, sidebar
- **Component-local State** - useState for ephemeral UI
- **Singleton Modals** - Single dialog instance for performance
- **Hydration-safe Time** - No SSR/client mismatches

## Key Concepts

### Task Types

**Parent Tasks (Projects)**
- Contain one or more subtasks
- Progress calculated automatically from children
- Use to break down vague goals like "Learn React"

**Leaf Tasks (Actionable Items)**
- No subtasks
- Manual progress tracking with slider
- Should be concrete and actionable

### Priority Levels
- **P0 (Low):** Nice to have, no urgency
- **P1 (Medium):** Standard priority
- **P2 (High):** Important, should do soon
- **P3 (Urgent):** Critical, immediate attention

### Energy Levels
- **High Focus:** Deep work requiring concentration
- **Low Energy:** Tasks you can do when tired
- **Quick Win:** Small, satisfying completions

## 📁 Project Structure

```
todolist/
├── app/
│   ├── dashboard/              # Main dashboard routes
│   │   ├── page.tsx            # All tasks view
│   │   ├── today/              # Today's focus
│   │   └── analytics/          # Analytics dashboard
│   ├── login/                  # Auth pages
│   └── auth/callback/          # OAuth callback
├── components/
│   ├── features/               # Feature-based organization
│   │   ├── tasks/              # Task management components
│   │   │   ├── task-list-client.tsx
│   │   │   ├── task-item.tsx   # Recursive component
│   │   │   ├── task-form-dialog.tsx
│   │   │   ├── todays-focus.tsx
│   │   │   └── draggable-task-card.tsx
│   │   ├── planning/           # Planning features
│   │   │   ├── morning-planner.tsx
│   │   │   └── daily-review.tsx
│   │   └── analytics/          # Analytics components
│   │       ├── analytics-dashboard.tsx
│   │       └── charts/
│   ├── layout/                 # Layout components
│   │   ├── dashboard-header.tsx
│   │   └── dashboard-nav.tsx
│   └── ui/                     # Shadcn UI primitives
├── lib/
│   ├── actions/                # Server Actions
│   │   └── task-actions.ts     # CRUD operations
│   ├── queries/                # Data fetching
│   │   └── task-queries.ts
│   ├── store/                  # Zustand stores
│   │   └── ui-store.ts         # Global UI state
│   ├── contexts/               # React contexts
│   │   └── user-context.tsx    # Client-only user
│   ├── hooks/                  # Custom hooks
│   │   └── use-time-check.ts
│   ├── services/               # Business logic
│   │   └── time-service.ts
│   ├── utils/                  # Utilities
│   │   ├── task-tree.ts        # Progress calculation
│   │   ├── task-scoring.ts     # Smart prioritization
│   │   └── client-time.tsx     # Hydration-safe time
│   └── supabase/               # Database
│       ├── client.ts           # Client-side
│       ├── server.ts           # Server-side
│       └── types.ts            # Generated types
└── supabase/
    └── migrations/             # Database migrations
        └── 20241127_initial.sql
```

## Usage Tips

### Creating Effective Tasks

✅ **Good:**
- "Read Chapter 3 of React docs (30 min)"
- "Write introduction section"
- "Review 10 flashcards"

❌ **Too Vague:**
- "Study React"
- "Work on project"
- "Be productive"

### Using Progress Tracking

1. **For Reading/Learning:**
   - Update progress as percentage completed
   - Example: 50/100 pages = 50% progress

2. **For Writing:**
   - Track by word count or sections completed
   - Example: 3/5 sections = 60% progress

3. **For Projects:**
   - Break into subtasks and let progress calculate automatically

## Customization

### Changing the Scoring Algorithm

Edit `lib/utils/task-scoring.ts` to adjust how tasks are prioritized:

```typescript
// Increase deadline weight
if (hoursUntilDeadline < 24) {
  score += 60; // Was 40
}
```

### Modifying Daily Review Time

Edit `app/dashboard/page.tsx`:

```typescript
// Change from 6 PM to 8 PM
if (hour >= 20 && !hasReviewedToday) {
```

## 🚀 Future Enhancements

- [ ] Recurring tasks
- [ ] Task templates
- [ ] Pomodoro timer integration
- [ ] Mobile responsive design
- [ ] Team collaboration features
- [ ] AI-powered task suggestions
- [ ] Calendar integration (Google/Outlook)
- [ ] Export to CSV/PDF
- [ ] Dark mode improvements
- [ ] Keyboard shortcuts

## 📝 License

MIT License - feel free to use this code for your own projects.

## 🙏 Acknowledgments

Built with inspiration from:
- Getting Things Done (GTD) methodology
- Quantified Self movement
- Evidence-based productivity research

---

**Remember:** The goal isn't to complete all tasks—it's to make consistent progress on what matters most. 🎯

---

<a id="chinese"></a>

# 量化自我任务管理系统 🚀

[English](#english) | [中文](#chinese)

一个基于 Next.js 16 构建的现代化生产力应用，专注于**可量化的进度**而非简单的任务完成。具备智能优先级排序、嵌套任务层级和可视化分析功能。

## 💡 核心理念：进度 > 完成度

本应用专注于**可量化的进度追踪**而非简单的复选框。它帮助你：
- 将大型项目分解为可执行的子任务
- 追踪持续工作的实际进度
- 智能决策下一步应该做什么
- 可视化你的生产力模式

## 🛠️ 技术栈

- **框架：** Next.js 16 (App Router, React 19, Turbopack)
- **语言：** TypeScript (严格模式)
- **样式：** Tailwind CSS
- **UI 组件：** Shadcn/UI
- **状态管理：** Zustand (UI状态) + Server Actions (数据)
- **数据库：** Supabase (PostgreSQL + 认证)
- **可视化：** Recharts
- **拖拽：** @dnd-kit/core
- **乐观更新：** React 19 useOptimistic Hook

## 🚀 快速开始

### 1. 前置要求

- Node.js 18+ 已安装
- Supabase 账号（免费版即可）

### 2. Supabase 配置

1. 在 [supabase.com](https://supabase.com) 创建新项目

2. 运行数据库模式：
   - 进入你的 Supabase 项目
   - 导航到 SQL 编辑器
   - 复制粘贴 `supabase/migrations/20241127_initial.sql` 的内容
   - 运行查询

3. 获取 API 凭证：
   - 进入 Project Settings > API
   - 复制 `Project URL` 和 `anon/public` 密钥

### 3. 环境变量配置

1. 复制 `.env.example` 为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 添加你的 Supabase 凭证：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
   ```

### 4. 安装并运行

```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 🚀 部署到 Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alvinluo-tech/quantify-todo)

### 手动部署

1. **推送到 GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin 你的仓库地址
   git push -u origin main
   ```

2. **导入到 Vercel:**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置环境变量:**
   
   在 Vercel 控制台添加以下环境变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的supabase地址
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
   ```

4. **部署:**
   - 点击 "Deploy"
   - Vercel 会自动构建和部署
   - 你的应用将上线到 `https://你的项目名.vercel.app`

### 重要说明

- ✅ **无需额外配置** - Next.js App Router 在 Vercel 上开箱即用
- ✅ **自动 HTTPS** - Vercel 提供 SSL 证书
- ✅ **边缘函数** - Server Actions 运行在 Vercel Edge Network
- ✅ **预览部署** - 每次 git push 都会生成预览 URL
- ⚠️ **环境变量** - 必须在 Vercel 控制台设置（而非 `.env.local`）
- ⚠️ **Supabase RLS** - 确保行级安全策略已正确配置

## ✨ 核心功能

### 📋 嵌套任务层级
- **无限嵌套** - 创建包含无限子任务的项目
- **自动计算进度** - 父任务自动从子任务计算进度
- **手动追踪** - 叶子任务使用手动进度滑块 (0-100%)
- **即时更新** - React 19 useOptimistic 乐观更新

### 🎯 今日专注
基于以下因素的智能优先级算法：
- **截止日期紧急度** - 逾期任务获得最高优先级
- **优先级等级** - P1-P5 (低到关键)
- **任务年龄** - 停滞任务得到提升
- **进度状态** - 进行中的任务优先
- **快速过滤** - "< 30分钟"、"高专注度"、"低能量"

### 🌅 晨间计划
- **拖拽界面** - 可视化任务规划
- **跨容器拖拽** - 在待办和今日之间移动任务
- **自动调度** - 自动设置 start_date
- **智能触发** - 每日首次登录时在 6-10 AM 自动打开
- **手动访问** - 通过顶部按钮随时可用

### 🌙 每日回顾
- **当日总结** - 晚上 6 点后自动弹出
- **进度追踪** - 显示已完成任务和记录时间
- **任务迁移** - 将未完成任务移至明天
- **归档管理** - 清理已完成工作

### 📊 分析仪表盘
- **活动热力图** - GitHub 风格贡献视图（30天）
- **燃尽图** - 追踪项目完成趋势
- **生产力洞察** - 可视化工作模式
- **任务分布** - 查看优先级和状态分布

### 🏗️ 现代化架构
- **Server Actions** - 类型安全的数据变更
- **乐观更新** - 即时 UI 反馈
- **全局 UI 状态** - Zustand 管理模态框、过滤器、侧边栏
- **组件局部状态** - useState 用于临时 UI
- **单例模态框** - 单一对话框实例提升性能
- **水合安全时间** - 无 SSR/客户端不匹配

## 📚 核心概念

### 任务类型

**父任务（项目）**
- 包含一个或多个子任务
- 进度自动从子任务计算
- 用于分解模糊目标，如"学习 React"

**叶子任务（可执行项）**
- 没有子任务
- 手动进度追踪（滑块）
- 应该具体且可执行

### 优先级等级
- **P1 (低):** 可以做，不紧急
- **P2 (中):** 标准优先级
- **P3 (高):** 重要，应尽快完成
- **P4 (紧急):** 关键，需要立即关注
- **P5 (危机):** 最高优先级

### 能量等级
- **高专注度:** 需要集中注意力的深度工作
- **低能量:** 疲惫时也能完成的任务
- **快速胜利:** 小型、令人满意的完成项

## 💡 使用技巧

### 创建有效的任务

✅ **好的示例:**
- "阅读 React 文档第 3 章（30 分钟）"
- "编写引言部分"
- "复习 10 张闪卡"

❌ **太模糊:**
- "学习 React"
- "完成项目"
- "提高效率"

### 使用进度追踪

1. **阅读/学习:**
   - 按完成百分比更新进度
   - 示例：50/100 页 = 50% 进度

2. **写作:**
   - 按字数或完成章节追踪
   - 示例：3/5 章节 = 60% 进度

3. **项目:**
   - 分解为子任务，让进度自动计算

## 🎨 自定义

### 修改评分算法

编辑 `lib/utils/task-scoring.ts` 来调整任务优先级：

```typescript
// 增加截止日期权重
if (hoursUntilDeadline < 24) {
  score += 60; // 原来是 40
}
```

### 修改每日回顾时间

编辑 `lib/services/time-service.ts`：

```typescript
// 从晚上 6 点改为 8 点
if (hour >= 20 && !hasReviewedToday) {
```

## 🚀 未来增强

- [ ] 重复任务
- [ ] 任务模板
- [ ] 番茄钟集成
- [ ] 移动端响应式设计
- [ ] 团队协作功能
- [ ] AI 驱动的任务建议
- [ ] 日历集成（Google/Outlook）
- [ ] 导出为 CSV/PDF
- [ ] 深色模式改进
- [ ] 键盘快捷键

## 📝 许可证

MIT License - 欢迎将此代码用于你自己的项目。

## 🙏 致谢

灵感来源：
- Getting Things Done (GTD) 方法论
- 量化自我运动
- 循证生产力研究

---

**记住：** 目标不是完成所有任务——而是在最重要的事情上持续取得进展。🎯
