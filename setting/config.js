'use strict';
const path 	   = require('path'),
	rootPath   = path.normalize(__dirname + '/..'),
	env        = process.env.NODE_ENV || 'development';

console.log('当前环境', env)

const config = {
	//开发者环境配置
	development: {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://img.sportgochina.com/images/'
		}
	},
	test: {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://img.sportgochina.com/images/'
		}
	},
	// 线上产品配置
	production : {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://img.sportgochina.com/images/'
		},
	}
}

module.exports = config[env];
