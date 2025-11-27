# 🔐 生产环境部署指南

## 已实现的功能

✅ **用户认证系统**
- 邮箱密码注册/登录
- Google OAuth 登录
- 会话管理和刷新
- 受保护的路由

✅ **数据安全**
- Row Level Security (RLS) 策略
- 用户只能访问自己的数据
- 安全的 API 密钥管理

## 部署步骤

### 1. 在 Supabase 启用 RLS

运行 `supabase/enable-rls-for-production.sql`：

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;
```

### 2. 配置 Google OAuth（可选）

如果要启用 Google 登录：

1. 进入 Supabase Dashboard → Authentication → Providers
2. 启用 Google provider
3. 配置 Google Cloud Console:
   - 创建 OAuth 2.0 客户端 ID
   - 添加授权重定向 URI: `https://prsnbxcezkhqiipccjpn.supabase.co/auth/v1/callback`
   - 复制 Client ID 和 Secret 到 Supabase

### 3. 配置邮箱确认（推荐）

1. Supabase Dashboard → Authentication → Settings
2. 配置邮箱模板（可选自定义）
3. 设置 Site URL 为你的生产域名

### 4. 环境变量检查

确保 `.env.local` 有正确的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://prsnbxcezkhqiipccjpn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### 5. 测试流程

1. **注册新用户**
   - 访问 `/login`
   - 点击"注册"
   - 输入邮箱和密码（至少 6 字符）
   - 检查邮箱验证邮件

2. **邮箱验证**
   - 点击邮件中的验证链接
   - 自动登录到 dashboard

3. **创建任务**
   - 现在任务会保存到该用户的账户下
   - 其他用户看不到你的任务

4. **登出和重新登录**
   - 点击右上角"登出"按钮
   - 使用相同凭证重新登录
   - 任务数据会保留

## 用户流程

### 新用户
```
访问 / → 重定向到 /login → 注册 → 验证邮箱 → 登录 → /dashboard
```

### 已登录用户
```
访问 / → 重定向到 /dashboard（自动登录）
```

### 未登录用户访问 dashboard
```
访问 /dashboard → 重定向到 /login
```

## 安全特性

### Row Level Security (RLS)

所有数据库操作都受 RLS 保护：

```sql
-- 用户只能看到自己的任务
SELECT * FROM tasks WHERE user_id = auth.uid();

-- 用户只能插入自己的任务
INSERT INTO tasks (..., user_id) VALUES (..., auth.uid());

-- 用户只能更新/删除自己的任务
UPDATE/DELETE tasks WHERE user_id = auth.uid();
```

### 会话管理

- 会话 token 存储在 HTTP-only cookies
- Middleware 自动刷新过期会话
- 登出时清除所有会话数据

### API 密钥安全

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - 可以公开，只用于客户端
- Secret key - 永远不要暴露，只在服务器端使用

## 开发 vs 生产

### 开发模式（当前）
- RLS 已启用
- 需要登录才能访问
- 使用真实的用户认证

### 测试模式（之前）
- RLS 禁用
- 使用固定 test user ID
- 不需要登录

## 常见问题

### Q: 用户注册后收不到验证邮件？
A: 检查 Supabase → Authentication → Email Templates，确保邮件服务已配置

### Q: Google 登录不工作？
A: 确保在 Google Cloud Console 配置了正确的回调 URL

### Q: 任务保存失败？
A: 检查：
1. 用户是否已登录
2. RLS 是否正确启用
3. 浏览器 Console 是否有错误

### Q: 如何添加更多登录方式？
A: Supabase 支持多种 OAuth 提供商：
- GitHub
- GitLab  
- Bitbucket
- Azure
- 等等

在 Authentication → Providers 中启用即可

## 部署到生产环境

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. 部署！

### 更新 Supabase Site URL

部署后，在 Supabase → Authentication → URL Configuration：
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: 添加生产域名

## 下一步增强

可选的功能：
- [ ] 社交登录（GitHub, Twitter 等）
- [ ] 忘记密码功能
- [ ] 用户资料管理
- [ ] 邮箱更改
- [ ] 账户删除
- [ ] 双因素认证 (2FA)
- [ ] 密码强度要求
- [ ] 登录历史记录

---

现在你的应用已经是**生产就绪**的了！🚀
