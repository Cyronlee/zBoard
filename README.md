<h1><img src="https://raw.githubusercontent.com/Cyronlee/zBoard/main/public/favicon.ico" width="48" height="48"> zBoard</h1>

[中文](https://github.com/Cyronlee/zBoard/blob/v2.0.0/README-zh.md)

Designed for DevOps teams, visualize daily information, fits perfectly on a large screen 🖥️

Build with:
![](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![](https://img.shields.io/badge/React-377DA0?style=flat-square&logo=react&logoColor=white)
![](https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white)
![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

<p>
  <a aria-label="GitHub package.json version" href="https://github.com/Cyronlee/zBoard/releases" title="GitHub package.json version">
    <img src="https://img.shields.io/github/package-json/v/cyronlee/zboard?style=for-the-badge">
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/Cyronlee/zBoard/Production?logo=Vercel&style=for-the-badge">
  </a>
</p>

Demo: [https://z-board.vercel.app/](https://z-board.vercel.app/)

![](https://github.com/Cyronlee/zBoard/blob/v2.0.0/docs/screenshots/dashboard.png?raw=true)

## Features ✨

**🚀 &nbsp;Handly informations**

- Monitor CICD Build Status (CircleCI & GitHub Actions supported)
- Monitor Ticket Status (Zendesk supported)
- Display Project Timeline (Kanbanize supported)

**🚙 &nbsp;Functional**

- All in one, no database needed
- Fast page render and responsive design
- An eye-catching swinging cat ([Authorized by davidkpiano](https://codepen.io/davidkpiano/pen/Xempjq))

**🎨 &nbsp;Customization**

- Resizeable & draggable to create custom layout
- Built with [chakra-ui](https://chakra-ui.com/getting-started), easy for customization

**🔒 &nbsp;Security**

- Site password
- All tokens secured in the backend
- No sensitive information in API transmission

## Quick Start

### Deploy on Vercel

1. Star this repo 😉
2. [Fork](https://github.com/Cyronlee/zBoard/fork) this project
3. Customize the config files and push the code, includes datasource and monitoring rules, please read the comments
   inside:
    - `site.config.js`
    - `build_status.config.js`
    - `ticket_status.config.js`
    - `project_timeline.config.js`
    - `owner_rotation.config.js`
4. Deploy on [Vercel](https://vercel.com), set following environment variables (will display fake data if no token is
   configured)：

- `SITE_PASSWORD`: If filled, the site requires a login
- `CIRCLE_CI_API_TOKEN`: CircleCI API Token to get build
  status, [get it here](https://app.circleci.com/settings/user/tokens)
- `ZENDESK_API_TOKEN`: Zendesk API Token to get ticket
  status, [follow this guide](https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token)
- `ZENDESK_USER_EMAIL`: The user email who generate the API token
- `ZENDESK_BASE_URL`: `https://<Your Org>.zendesk.com`
- `GITHUB_API_TOKEN`: GitHub API Token to get build status from GitHub Actions
- `KANBANIZE_BASE_URL`: `https://<Your Org>.kanbanize.com`
- `KANBANIZE_API_KEY`: Kanbanize API Key to build project timeline, [follow this guide](https://kanbanize.com/api)
- `API_TABLE_API_KEY`: ApiTable API Key to load owner rotation
  data, [follow this guide](https://developers.apitable.com/api/quick-start#step-1-get-api-token)

5. Visit your site🎉

### Deploy on Mac mini

1. On the Mac mini, hold `command` and click WIFI icon to get the IP address
2. On your Mac (under same network), use `command`+`p` to search & open `Sreen Sharing` app
3. Enter the IP of Mac mini, then login to control the Mac mini
4. Follow the steps of `Local development`

### Local development

1. Star & Clone this repo 😉
2. Install node 18 via `nvm install 18`, then `nvm use 18`
3. Customize the config files in local, includes datasource and monitoring rules, please read the comments inside:
    - `site.config.js`
    - `build_status.config.js`
    - `ticket_status.config.js`
    - `project_timeline.config.js`
    - `owner_rotation.config.js`
4. Copy `.env.example` to be `.env`, and set the values
5. Run with development mode
   ```bash
   npm install
   npm run dev
   ```
6. Or run with production mode
   ```bash
   npm run build
   npm run start
   ```
7. Visit http://localhost:2000/

### Contribute more widgets

zBoard provides [a builder page](https://z-board.vercel.app/builder) that user can drag or resize widgets to build
custom layout.

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
├── NewWidget              <- add your new widget here
│     ├── index.tsx        <- export your widget with index.tsx
│     └── preview.png      <- the widget thumnail
└── index.tsx              <- define the widget's initial props
```

### Update to new version

Please backup your config files before update, config structure may be modified in major version updates.

```bash
# backup config files
git stash

# update main version
git checkout main
git pull origin main

# apply your backup config files
git stash apply
```

## Roadmap

- [x] CircleCI Build Status
- [x] Zendesk Ticket Status
- [x] Kanbanize project timeline
- [x] Site password
- [x] Dark mode
- [x] Examples page
- [x] Check for new versions
- [x] Owner shift indicator
- [x] Resizeable & draggable
- [ ] Settings page
- [ ] Integrate more products...
- [ ] ...

## License

The MIT License.
