'use strict';
const express = require('express'),
config        = require('./setting/config');

var app = express();

// 应用程序加载
require('./setting/express')(app, config);

app.listen(config.port, () => console.log('Express server listening on port ' + config.port))