# Development
## Prerequisites
- install node.js
- install MongoDB server
- install angular-cli
## Spin up Node.js API server
`cd api-server`<br>
`npm install`<br>
`node bin/www`<br>

## Spin up SPAs in dev mode
- Install dependencies
  
  `cd web-apps`<br>
  `npm install`<br>
- Admin SPA (http://localhost:4200/)

`cd web-apps`<br>
`ng serve admin`<br>
- Driver SPA (http://localhost:4222/)

`cd web-apps`<br>
`ng serve driver`<br>

- Tracker SPA (http://localhost:4224/)

`cd web-apps`<br>
`ng serve tracker`<br>

# Running with external resources
 
- Node.js - remote db
set environment variable MONGODB_URI before launching node process
