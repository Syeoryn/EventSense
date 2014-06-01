var express = require('express')
    routes = require('./routeHelpers')
    app = express()
    routers = {};

require('./config')(app, express, routers);

app.get('/', routes.placeHolder);

module.exports = app;
