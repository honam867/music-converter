const path = require("path");
const fs = require("fs");

const ROUTE_PATH = "../routes";

function loadRouter(routerFolder, routerFile) {
  let routerPath = `${routerFolder}/${routerFile}`;
  if (routerPath.endsWith("index.router.js")) {
    routerPath = routerPath.replace(/index\.router\.js$/, "").slice(0, -1);
  } else {
    routerPath = routerPath.replace(/\.router\.js$/, "");
  }
  const filePath = `${ROUTE_PATH}${routerFolder}/${routerFile}`;

  return {
    ...require(filePath),
    routerPath,
    filePath,
  };
}

function findRouter(dirPath, base = "") {
  const routes = [];

  fs.readdirSync(dirPath, { withFileTypes: true }).forEach((file) => {
    if (file.isDirectory()) {
      routes.push(
        ...findRouter(path.join(dirPath, file.name), `${base}/${file.name}`)
      );
    } else if (file.name.endsWith(".router.js")) {
      const route = loadRouter(base, file.name);
      if (route.router) routes.push(route);
    }
  });

  return routes;
}

function initRouter({ app }) {
  const activityMethods = {};
  app.set("activityMethods", activityMethods);

  const routes = findRouter(path.join(__dirname, ROUTE_PATH));

  routes.forEach((route) => {
    app.use(route.routerPath, route.router);
    activityMethods[route.routerPath] = route.activity;
    // logger.info(`loading router ${route.routerPath} -> ${route.filePath}`);
  });
  // routeOTT(app);
}

module.exports = initRouter;
