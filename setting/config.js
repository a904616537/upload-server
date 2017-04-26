'use strict';
const path 	   = require('path'),
	rootPath   = path.normalize(__dirname + '/..'),
	env        = process.env.NODE_ENV || 'production';

console.log('当前环境', env)

const config = {
	//开发者环境配置
	development: {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://localhost:8082/images/'
		}
	},
	test: {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://image.kainaltion.cn/images/'
		}
	},
	// 线上产品配置
	production : {
		root         : rootPath,
		port         : 8082,
		app          : {
			name : 'company',
			host : 'http://admin.skyfortune.sh.cn/images/'
		},
	}
}

module.exports = config[env];
