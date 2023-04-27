<h1><img src="https://raw.githubusercontent.com/Cyronlee/zBoard/main/public/favicon.ico" width="48" height="48"> zBoard</h1>

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
  <a aria-label="GitHub commit activity" href="https://github.com/Cyronlee/zBoard/commits/main" title="GitHub commit activity">
    <img src="https://img.shields.io/github/commit-activity/m/Cyronlee/zBoard?style=for-the-badge">
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/Cyronlee/zBoard/Production?logo=Vercel&style=for-the-badge">
  </a>
</p>

Demo: [https://z-board.vercel.app/](https://z-board.vercel.app/) Password: 123456
![](https://github.com/Cyronlee/zBoard/blob/main/docs/screenshots/dashboard.jpg?raw=true")

## Features ✨

**🚀 &nbsp;Handly informations**

- Monitor CICD Build Status (CircleCI supported)
- Monitor Ticket Status (Zendesk supported)
- Display Project Timeline (Kanbanize supported)

**🚙 &nbsp;Functional**

- All in one, no database needed
- Fast page render and responsive design

**🎨 &nbsp;Customization**

- Built with [chakra-ui](https://chakra-ui.com/getting-started), easy for customization
- Customize config options

**🔒 &nbsp;Security**

- Site password
- All tokens secured in the backend
- No sensitive information in API transmission


## Quick Start

### Deploy on Vercel

1. Star this repo 😉
2. [Fork](https://github.com/Cyronlee/zBoard/fork) this project
3. Customize the config files:
   - `site.config.js`
   - `circle_ci.config.js`
   - `zendesk.config.js`
   - `kanban.config.js`
   - `owner_rotation.config.js`
4. Deploy on [Vercel](https://vercel.com), set following environment variables (will display fake data if no token is configured)：
  - `SITE_PASSWORD`: If filled, the site requires a login
  - `CIRCLE_CI_API_TOKEN`: CircleCI API Token to get build status, [get it here](https://app.circleci.com/settings/user/tokens)
  - `ZENDESK_API_TOKEN`: Zendesk API Token to get ticket status, [follow this guide](https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token)
  - `ZENDESK_USER_EMAIL`: The user email who generate the API token
  - `ZENDESK_BASE_URL`: `https://<Your Org>.zendesk.com`
  - `KANBANIZE_BASE_URL`: `https://<Your Org>.kanbanize.com`
  - `KANBANIZE_API_KEY`: Kanbanize API Key to build project timeline, [follow this guide](https://kanbanize.com/api)
5. Visit your site🎉

### Deploy on Mac mini

1. On the Mac mini, hold `command` and click WIFI icon to get the IP address
2. On your Mac (under same network), use `command`+`p` to search & open `Sreen Sharing` app
3. Enter the IP of Mac mini, then login to control the Mac mini
4. Follow the steps of `Local development`


### Local development

1. Star & Clone this repo 😉
2. Install node 18 via `nvm use 18`
3. Customize the config files:
   - `site.config.js`
   - `circle_ci.config.js`
   - `zendesk.config.js`
   - `kanban.config.js`
   - `owner_rotation.config.js`
4. Copy `.env.example` to be `.env`, and set the values
5. [Optional] If you'd like to prepare data for owner rotation, create an ApiTable like this [link](https://apitable.com/share/shrvpzFE4CmCF59ygUbaW) 
   or a GoogleSheet like this [link](https://docs.google.com/spreadsheets/d/15txMkkkWBgxS7PCpInC3NBg9kaEi-ZhHjdALNRV-5G8/edit?usp=sharing)
6. Run with development mode
   ```bash
   npm install
   npm run dev
   ```
7. Or run with production mode
   ```bash
   npm run build
   npm run start
   ```
8. Visit http://localhost:2000/


## Roadmap

- [x] CircleCI Build Status
- [x] Zendesk Ticket Status
- [x] Kanbanize project timeline
- [x] Site password
- [x] Dark mode
- [x] Examples page
- [x] Check for new versions
- [ ] Owner shift indicator
- [ ] Integrate more products...
- [ ] Resizeable & draggable
- [ ] Settings page
- [ ] ...


## License

The MIT License.
