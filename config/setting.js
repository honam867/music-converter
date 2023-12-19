// const dotenv = require('dotenv');
// const local = require('./setting.local');
// const product = require('./setting.production');

const env = process.env.NODE_ENV;
console.log("NODE_ENV", env);

// load env file
// dotenv.config({ path: `${__dirname}/../.env` });
// console.log(process.env.COZRUM_IMESSAGE_RESOURCES);

module.exports =
  env === "production"
    ? require("./setting.production")
    : require("./setting.local");
