
# ![](https://raw.githubusercontent.com/Cyronlee/zBoard/main/public/favicon.ico) zBoard

An awesome board for displaying your team's daily information, fits perfectly on a large screen

<p>
  <a aria-label="GitHub commit activity" href="https://github.com/Cyronlee/zBoard/commits/main" title="GitHub commit activity">
    <img src="https://img.shields.io/github/commit-activity/m/Cyronlee/zBoard?style=for-the-badge">
  </a>
  <a aria-label="GitHub contributors" href="https://github.com/Cyronlee/zBoard/graphs/contributors" title="GitHub contributors">
    <img src="https://img.shields.io/github/contributors/Cyronlee/zBoard?color=orange&style=for-the-badge">
  </a>
  <a aria-label="Build status" href="#" title="Build status">
    <img src="https://img.shields.io/github/deployments/Cyronlee/zBoard/Production?logo=Vercel&style=for-the-badge">
  </a>
</p>

Demo: [https://z-board.vercel.app/](https://z-board.vercel.app/)
![](https://github.com/Cyronlee/zBoard/blob/main/docs/screenshots/home.png?raw=true")

## Features ✨

**🚀 &nbsp;Daily informations**

- Monitor CICD Build Status (CircleCI supported)
- Monitor Ticket Status (Zendesk supported)
- Display Project Timeline (Kanbanize supported)

**🎨 &nbsp;Easy for customization**

- Built with chakra-ui CSS, easy for customization
- Customize config options

**🔒 &nbsp;Safety**

- All tokens managed in backend
- No sensitive information in API transmission

**🚙 &nbsp;Fully functional**

- Auto refresh
- Fast page render and responsive design


## Quick Start

### Deploy on Vercel

1. Star this repo 😉
1. [Fork](https://github.com/Cyronlee/zBoard/fork) this project
1. Customize the config files:
   - `site.config.js`
   - `circle_ci.config.js`
   - `zendesk.config.js`
   - `kanban.config.js`
3. Deploy on [Vercel](https://vercel.com), set following environment variables (will display fake data if no token configured)：
  - `CIRCLE_CI_API_TOKEN`: CircleCI API Token to get build status, [get it here](https://app.circleci.com/settings/user/tokens)
  - `ZENDESK_API_TOKEN`: Zendesk API Token to get ticket status, [follow this guide](https://support.zendesk.com/hc/en-us/articles/4408889192858-Generating-a-new-API-token)
  - `ZENDESK_USER_EMAIL`: The user email who generate the API token
  - `ZENDESK_BASE_URL`: `https://<Your Org>.zendesk.com`
  - `KANBANIZE_BASE_URL`: `https://<Your Org>.kanbanize.com`
  - `KANBANIZE_API_KEY`: Kanbanize API Key to build project timeline, [follow this guide](https://kanbanize.com/api)

### Local development

1. Star & Clone this repo 😉
2. Install node 18 via `nvm use 18`
3. Customize the config files:
   - `site.config.js`
   - `circle_ci.config.js`
   - `zendesk.config.js`
   - `kanban.config.js`
4. Copy `.env.example` to be `.env`, and set the values
5. Run with development mode
   ```bash
   npm install
   
   npm run dev
   ```
6. Visit http://localhost:2000/


## Roadmap

- [x] CircleCI Build Status
- [x] Zendesk Ticket Status
- [x] Kanbanize project timeline
- [ ] Integrate more platform...
- [ ] Site password
- [ ] Check for new versions
- [ ] Resizeable & draggable
- [ ] Dark mode
- [ ] Settings page
- [ ] Examples page
- [ ] ...


## License

The MIT License.
