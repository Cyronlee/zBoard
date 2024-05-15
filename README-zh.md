<h1><img src="https://raw.githubusercontent.com/Cyronlee/zBoard/main/public/favicon.ico" width="48" height="48"> zBoard</h1>

专为 DevOps 团队设计的项目信息可视化面板，非常适合大屏幕展示 🖥️

技术栈：
![](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![](https://img.shields.io/badge/React-377DA0?style=flat-square&logo=react&logoColor=white)
![](https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<p>
  <a aria-label="GitHub package.json 版本" href="https://github.com/Cyronlee/zBoard/releases" title="GitHub package.json 版本">
    <img src="https://img.shields.io/github/package-json/v/cyronlee/zboard?style=for-the-badge"> 
  </a>
  <a aria-label="构建状态" href="#" title="构建状态">
    <img src="https://img.shields.io/github/deployments/Cyronlee/zBoard/Production?logo=Vercel&style=for-the-badge"> 
  </a>
</p>

演示站点：[https://z-board.vercel.app/](https://z-board.vercel.app/)

![](https://github.com/Cyronlee/zBoard/blob/v2.0.0/docs/screenshots/dashboard.png?raw=true)

## 特性 ✨

**🚀 &nbsp;实用信息**

- 监控 CI/CD 构建状态（支持 CircleCI 和 GitHub Actions）
- 监控工单状态（支持 Zendesk）
- 显示项目时间线（支持 Kanbanize）

**🚙 &nbsp;功能性**

- 一体化设计，无需数据库
- 快速页面渲染和响应式设计
- 引人注目的荡秋千猫猫 ([由 davidkpiano 授权](https://codepen.io/davidkpiano/pen/Xempjq))

**🎨 &nbsp;定制化**

- 小部件可调整大小和拖拽，以创建自定义布局
- 使用 [chakra-ui](https://chakra-ui.com/getting-started) 构建，易于定制

**🔒 &nbsp;安全性**

- 网站密码
- 所有令牌在后端安全存储
- API 传输中不包含敏感信息

## 快速开始

### 在 Vercel 上部署

1. Star 这个项目 😉
2. [Fork](https://github.com/Cyronlee/zBoard/fork) 这个项目到你自己的账户
3. 自定义配置文件并推送代码，包括数据源和监控规则，请阅读内部注释：
    - `site.config.js`
    - `build_status.config.js`
    - `ticket_status.config.js`
    - `project_timeline.config.js`
    - `owner_rotation.config.js`
4. 在 [Vercel](https://vercel.com) 上部署，设置以下环境变量（如果没有配置令牌，则显示假数据）：

- `SITE_PASSWORD`: 如果填写，网站需要登录
- `CIRCLE_CI_API_TOKEN`: CircleCI API 令牌以获取构建状态，[在这里获取](https://app.circleci.com/settings/user/tokens)
- `ZENDESK_API_TOKEN`: Zendesk API
  令牌以获取工单状态，[按照这个指南操作](https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token)
- `ZENDESK_USER_EMAIL`: 生成 API 令牌的用户的电子邮件
- `ZENDESK_BASE_URL`: `https://<您的组织>.zendesk.com`
- `GITHUB_API_TOKEN`: GitHub API 令牌以从 GitHub Actions 获取构建状态
- `KANBANIZE_BASE_URL`: `https://<您的组织>.kanbanize.com`
- `KANBANIZE_API_KEY`: Kanbanize API 密钥以构建项目时间线，[按照这个指南操作](https://kanbanize.com/api)
- `API_TABLE_API_KEY`: ApiTable API
  密钥以加载所有者轮换数据，[按照这个指南操作](https://developers.apitable.com/api/quick-start#step-1-get-api-token)

5. 访问你的网站🎉

### 在 Mac mini 上部署

1. 在 Mac mini 上，按住 `command` 并点击 WIFI 图标以获取 IP 地址
2. 在你的 Mac（在同一网络下），使用 `command`+`p` 搜索并打开 `屏幕共享` 应用
3. 输入 Mac mini 的 IP 地址，然后登录以控制 Mac mini
4. 按照 `本地开发` 的步骤操作

### 本地开发

1. 点赞并克隆这个仓库 😉
2. 通过 `nvm install 18` 安装 node 18，然后 `nvm use 18`
3. 在本地自定义配置文件，包括数据源和监控规则，请阅读内部注释：
    - `site.config.js`
    - `build_status.config.js`
    - `ticket_status.config.js`
    - `project_timeline.config.js`
    - `owner_rotation.config.js`
4. 复制 `.env.example` 为 `.env`，并设置值
5. 以开发模式运行
   ```bash
   npm install
   npm run dev
   ```
6. 或以生产模式运行
   ```bash
   npm run build
   npm run start
   ```
7. 访问 http://localhost:2000/

### 贡献更多小部件

zBoard 提供了一个 [构建器页面](https://z-board.vercel.app/builder)，用户可以通过拖拽或调整大小来构建自定义布局。

![](https://github.com/Cyronlee/zBoard/blob/v2.0.0/docs/screenshots/builder.gif?raw=true)

```txt
./src/widgets
├── BuildStatusWidget
│     ├── BuildStatusCard.tsx
│     ├── index.tsx
│     └── preview.png
├── OwnerRotationWidget
│     ├── OwnerRotationCard.tsx
│     ├── index.tsx
│     └── preview.png
├── ProjectTimelineWidget
│     ├── index.tsx
│     └── preview.png
├── ZendeskStatusWidget
│     ├── TicketList.tsx
│     ├── index.tsx
│     └── preview.png
├── NewWidget              <- 在这里添加你的新小部件
│     ├── index.tsx        <- 在 index.tsx 中导出你的小部件
│     └── preview.png      <- 小部件缩略图
└── index.tsx              <- 定义小部件的初始属性
```

### 更新到新版本

在更新之前，请备份你的配置文件，因为主要版本更新可能会修改配置结构。

```bash
# 备份配置文件
git stash

# 更新主版本
git checkout main
git pull origin main

# 应用备份的配置文件
git stash apply
```

## 路线图

- [x] CircleCI 构建状态
- [x] Zendesk 工单状态
- [x] Kanbanize 项目时间线
- [x] 网站密码
- [x] 暗模式
- [x] 示例页面
- [x] 检查新版本
- [x] 所有者换班指示器
- [x] 可调整大小和拖拽
- [ ] 设置页面
- [ ] 集成更多产品...
- [ ] ...

## 许可证

MIT 许可证
