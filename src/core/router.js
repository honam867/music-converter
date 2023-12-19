const express = require("express");
const _ = require("lodash");

const { logger } = require("@utils/logger");
// const { _T } = require("@utils/translation");
const ThrowReturn = require("./throwreturn");
// const { jwtVerify, userLog, role, publishJwtVerify } = require('./middleware');

function process_exception(req, res, error) {
  let error_code = 0;
  let error_msg;

  if (error instanceof ThrowReturn || error.name === "ThrowReturn") {
    error_code = error.code;
    error_msg = error.message;
    if (error.statusCode) res.status(error.statusCode);
  } else {
    error_code = 1;
    if (error.name === "ValidationError") {
      error_msg =
        _.get(_.head(_.values(error.errors)), "message") || error.message;
      res.status(422);
    } else {
      logger.error(error);
      error_msg = "error.sys.internal";
      res.status(500);
    }
  }

  res.json({
    error_code,
    error_msg: error_msg,
    data: error.data,
  });
}

/**
 * Common & custom reponse
 */
function sendData(data) {
  const response = { error_code: 0, data };
  this.json(response);
}

/**
 * safety call router.get function
 * eg: router.get('abc', safety(callback))
 *
 * @param  {Function} callback    [description]
 * @param validateToken
 * @param  {Function} exception [description]
 */
function safety(callback, validateToken, exception = process_exception) {
  return async function (req, res, next) {
    try {
      req.validateToken = validateToken;
      res.sendData = sendData;

      await callback(req, res, next);
    } catch (error) {
      exception(req, res, error);
    }
  };
}

function createSafetyMethod(method, middlewares, validate) {
  return function (path, ...args) {
    const validateToken =
      typeof _.last(args) === "boolean" ? _.last(args) : validate;
    const funcs = [...middlewares, ...args]
      .filter((cb) => typeof cb === "function")
      .map((m) => safety(m, validateToken));

    this[method](path, ...funcs);
  };
}

function routes({ middlewares = [], validate = true, options = null }) {
  const router = express.Router(options);

  router.getS = createSafetyMethod("get", middlewares, validate);
  router.postS = createSafetyMethod("post", middlewares, validate);
  router.putS = createSafetyMethod("put", middlewares, validate);
  router.deleteS = createSafetyMethod("delete", middlewares, validate);

  return router;
}

const ApiRouter = () =>
  routes({
    middlewares: [],
    validate: true,
  });
const PublishRouter = () => routes({ middlewares: [], validate: false });
module.exports = {
  safety,
  Router: ApiRouter,
  Publish: PublishRouter,
};
