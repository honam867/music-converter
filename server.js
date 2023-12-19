require("module-alias/register");
require("gf-js");
require("dnscache")({
  enable: true,
  ttl: 300,
  cachesize: 1000,
});

global.isDev = process.env.NODE_ENV !== "production";

const initExpress = require("./src/init/express");
const initRouter = require("./src/init/router");
const { initDB } = require("./src/init/db");

(async function init() {
  const express = initExpress();
  await initDB(express);
  initRouter(express);
})();
