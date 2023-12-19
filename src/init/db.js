const mongoose = require("mongoose");

const { DB } = require("@config/setting");
const { logger } = require("@utils/logger");

function initDB() {
  mongoose.connection
    .on("error", (err) => logger.error("mongodb connect error", err))
    .on("disconnected", (e) => logger.error("mongodb disconnected", e));

  return mongoose
    .connect(DB.MAIN, DB.OPTIONS)
    .then(() => {
      logger.info("mongodb connected");
    })
    .catch((e) => {
      logger.error("mongodb connect error", e);
    });
}

module.exports = {
  initDB,
};
