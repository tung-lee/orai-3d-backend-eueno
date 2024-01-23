const express = require("express");
const cors = require('cors')

function config(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors())
}

module.exports = config;
