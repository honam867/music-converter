// const mongoose = require('mongoose');
const _ = require("lodash");

const router = require("@core/router").Router();
// const ThrowReturn = require("@core/throwreturn");
// const userutils = require("@utils/userutils");
// const models = require('@models');

async function getUserInfo(req, res) {
  res.sendData("HELLO WORLD");
}

router.getS("/", getUserInfo);

module.exports = { router };
