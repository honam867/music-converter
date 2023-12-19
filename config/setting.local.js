const SERVER_CONFIG = {
  PORT: 8080,
  //   STATIC: {
  //     URI: "/static/",
  //     PATH: `${__dirname}/../publish`,
  //     OPTIONS: {
  //       maxAge: "365d",
  //     },
  //   },
};

const DB = {
  MAIN: "mongodb://localhost:27017/music_converter",
  OPTIONS: {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  },
};

module.exports = { SERVER_CONFIG, DB };
