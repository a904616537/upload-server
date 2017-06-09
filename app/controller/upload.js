'use strict';


var express = require('express'),
fs          = require('fs'),
formidable  = require('formidable'),
config      = require('../../setting/config'),
router      = express.Router(),
cacheFolder = config.root + '/public/images/';

// var uploadFilesPath = '/upload_files/';
// var multiparty      = require('connect-multiparty')({uploadDir:uploadFilesPath})


router.route('/upload')
.post((req, res) => {
    var userDirPath = cacheFolder;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    // console.log('req' , req)
	var form            = new formidable.IncomingForm(); //创建上传表单
	form.encoding       = 'utf-8'; 			//设置编辑
	form.uploadDir      = userDirPath;		//设置上传目录
	form.keepExtensions = true; 			//保留后缀
	form.maxFieldsSize  = 2 * 1024 * 1024; 	//文件大小
	form.type           = true;

    var displayUrl;
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send(err);
            return;
        }
        var extName = ''; //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length === 0) {
            res.send({
				code : 202,
				msg  : '只支持png和jpg格式图片'
            });
            return;
        } else {
			var avatarName = Date.now() + '.' + extName;
			var newPath    = form.uploadDir + avatarName;
			displayUrl     = config.app.host + avatarName;
			
            fs.renameSync(files.file.path, newPath); //重命名
            res.send({
				code : 200,
				msg  : displayUrl
            });
        }
    })
    // res.send('asdsada')
})

module.exports = app => {
  app.use('/', router);
}