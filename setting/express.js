'use strict';

const express  = require('express'),
glob           = require('glob'),
logger         = require('morgan'),
bodyParser     = require('body-parser'),
compress       = require('compression'),
methodOverride = require('method-override'),
ejs            = require('ejs'),
zlib           = require('zlib');


module.exports = (app, config) => {

    app.all('*',function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control,Origin,X-Requested-With,Content-Type,Accept,Authorization,Referer");
        if (req.method == 'OPTIONS') {
            console.log('快速返回！')
            res.sendStatus(200);
        }
        else {
            next();
        }
    });

    app.engine('html', ejs.__express);
    app.set('views', config.root + '/app/view');
    app.set('view engine', 'html');

    app.use(express.static(config.root + '/public/'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended : false}))

    app.use(methodOverride());
    app.use(compress({
		level    : zlib.Z_BEST_COMPRESSION,
		memLevel : 1
    }))    

    var controllers = glob.sync(config.root + '/app/controller/*.js');

    controllers.forEach(controller => {
		console.log('Loading Router：', controller);
        require(controller)(app);
    })

    app.use((req, res, next) => {
        var err = new Error('Not Found');
        err.status = 404;
        res.send({
			message : '您访问的页面不存在',
			error   : err,
			errcode   : 404
        });
    })

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error  : {},
            errcode  : 500
        });
        
    })
}