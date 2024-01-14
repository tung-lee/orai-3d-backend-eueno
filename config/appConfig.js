const express = require("express");

function config(app) {
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

module.exports = config;
