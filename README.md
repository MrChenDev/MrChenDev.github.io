# 陈工的世界 · GitHub Pages 静态版

本仓库是 [chendev.cn](https://chendev.cn) 的**静态镜像版**，托管于 GitHub Pages。

原站是 Next.js（Turbopack）服务端渲染应用，GitHub Pages 只提供静态托管，
因此本站是**内容与视觉的静态重建**，不是原站的代码复制。

## 技术栈

- 纯静态 HTML / CSS / 原生 JS
- 零构建、零依赖、零框架
- 相对路径资源引用（根域名与子路径两种部署方式都能跑）
- 深色 / 浅色主题切换（localStorage 持久化 + 跟随系统偏好）
- 响应式（移动端汉堡菜单）
- 无障碍：跳过导航链接、`aria-*`、`focus-visible`、`prefers-reduced-motion`

## 目录结构

```
.
├── index.html          首页
├── services.html       服务提供
├── projects.html       项目基地
├── music.html          音乐小屋
├── photography.html    摄影展厅
├── contact.html        联系我
├── 404.html            404 页
├── .nojekyll           关闭 GitHub Pages 的 Jekyll 处理
└── assets/
    ├── style.css       全部样式
    ├── main.js         交互增强
    ├── logo.png        导航 Logo（已压缩至 25 KB）
    ├── favicon.png     站点图标（原站 favicon.ico 为 404，本站已补全）
    ├── avatar.jpg      头像
    └── photos/         摄影作品（已压缩）
```

## 部署步骤

### 1. 创建仓库

> **重要**：GitHub Pages 规定根站点仓库名必须等于 `<你的用户名>.github.io`。
> 用户名是 `MrChenDev`，所以仓库必须叫 `MrChenDev.github.io`，**不能**叫 `chendev.github.io`。

在 <https://github.com/new> 新建仓库，名称填 `MrChenDev.github.io`，可见性设为 **Public**（Private 仓库需要付费版才能开 Pages）。

### 2. 推送代码

```bash
cd chendev-homepage
git init
git add .
git commit -m "feat: 陈工的世界静态版，迁移自 chendev.cn"
git branch -M main
git remote add origin https://github.com/MrChenDev/MrChenDev.github.io.git
git push -u origin main
```

### 3. 开启 Pages

进入仓库 **Settings → Pages**：

- **Source** 选 `Deploy from a branch`
- **Branch** 选 `main`，目录选 `/ (root)`
- 点 **Save**

约 1–2 分钟后访问 <https://MrChenDev.github.io>。

### 4. 如果改用子路径仓库

若坚持用 `chendev.github.io` 作仓库名，则访问地址变为
`https://MrChenDev.github.io/chendev.github.io/`。
本站所有资源均为相对路径，**可以直接正常工作**，但需要同步修改各页
`<link rel="canonical">` 与 `og:*` 中的绝对地址。

## 与原站的差异（有意为之）

| 项目 | 原站 chendev.cn | 本站 |
| --- | --- | --- |
| 渲染方式 | Next.js SSR | 纯静态 |
| 主题切换 | 支持 | 支持（本地持久化） |
| 中英切换 | 支持 | **暂未支持**（需全量文案双语化） |
| 联系表单 | 后端 API 接收 | 唤起本机邮件客户端（无后端） |
| 点赞数 / 浏览量 | 来自 `/api/site/like` | 显示原站抓取值（静态快照） |
| 摄影作品 | 完整作品集 | 4 件代表作品 |
| ICP 备案号 | 页脚展示 | **已移除**（见下文） |

### 为什么移除 ICP 备案号

ICP 备案是**域名级**许可，与 `chendev.cn` 绑定。`*.github.io` 域名既无法备案、也不需要备案。
在本站展示 `粤ICP备2025387170号` 会造成备案主体与访问域名不符的误导，因此移除。

若日后将 `chendev.cn` 通过 CNAME 指向 GitHub Pages，则应把备案号加回页脚。

## 顺带修掉的原站问题

1. `og:url` / `og:image` 原为占位符 `https://yourwebsite.com` → 已替换为真实地址
2. `google-site-verification` / `yandex-verification` 原为 `your-xxx-code` 占位 → 已移除（需要时填真实值）
3. `favicon.ico` 返回 404 → 已用 Logo 生成 `favicon.png`
4. **滚动动画导致内容不可见**：原站用内联 `opacity:0` 隐藏 bio、统计卡、作品网格，
   JS 失效或 `prefers-reduced-motion` 下内容直接消失。本站改为仅当 `html.js` 存在时才隐藏，
   并在 `prefers-reduced-motion` 下强制可见，另加 2.5 秒兜底显示。

## 本地预览

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

然后访问 <http://localhost:8000>。

## 素材版权

Logo、头像、摄影作品均来自作者本人（chendev.cn），版权归作者所有。
