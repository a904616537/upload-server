'use strict';


var express = require('express'),
fs          = require('fs'),
formidable  = require('formidable'),
config      = require('../../setting/config'),
multer      = require('multer'),
cacheFolder = config.root + '/public/images/',
router      = express.Router();


const storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination(req, file, cb) {
        cb(null, cacheFolder)
    },
    //给上传文件重命名，获取添加后缀名
    filename(req, file, cb) {
        const fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//添加配置文件到muler对象。
const upload = multer({
    storage: storage
});

const nativeUpload = upload.single('file');
// var uploadFilesPath = '/upload_files/';
// var multiparty      = require('connect-multiparty')({uploadDir:uploadFilesPath})


router.route('/native/upload')
.post((req, res) => {
    nativeUpload(req, res, (err) => {
        //添加错误处理
        if (err) {
            return  console.error(err);
        } 
        //文件信息在req.file或者req.files中显示。
        console.log('file', req.file);
        var userDirPath = cacheFolder;
        if (!fs.existsSync(userDirPath)) {
            fs.mkdirSync(userDirPath);
        }
        
        var form            = new formidable.IncomingForm(); //创建上传表单
        form.encoding       = 'utf-8';          //设置编辑
        form.uploadDir      = userDirPath;      //设置上传目录
        form.keepExtensions = true;             //保留后缀
        form.maxFieldsSize  = 2 * 1024 * 1024;  //文件大小
        form.type           = true;
        
        var displayUrl;
        var file = req.file;
        var extName = ''; //后缀名
        console.log('file', file);
        console.log('filetype', file.mimetype);
        switch (file.mimetype) {
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
            case 'video/mp4':
                extName = 'mp4';
                break;
            case 'video/x-m4v': 
                extName = 'm4v';
                break;
        }
        var avatarName = Date.now() + '.' + extName;
        var newPath    = form.uploadDir + avatarName;
        displayUrl     = config.app.host + avatarName;
        
        fs.renameSync(file.path, newPath); //重命名
        res.send({
            code : 200,
            msg  : displayUrl
        });
    })
});


router.route('/upload')
.get((req, res) => {
    res.send('upload is ok!')
})
.post((req, res) => {
    var userDirPath = cacheFolder;
    if (!fs.existsSync(userDirPath)) {
        fs.mkdirSync(userDirPath);
    }
    
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
        console.log('files', files)
        let file = files.file? files.file : files['file[0]'];
        var extName = ''; //后缀名
        console.log('file', file);
        console.log('filetype', file.type);
        switch (file.type) {
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
            case 'video/mp4':
                extName = 'mp4';
                break;
            case 'video/x-m4v': 
                extName = 'm4v';
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
			
            fs.renameSync(file.path, newPath); //重命名
            res.send({
				code : 200,
				msg  : displayUrl
            });
        }
    })
})

router.route('/download')
.get((req, res) => {
    const {path, name} = req.query;

    const filepath = cacheFolder + path;
    res.download(filepath, name);
})

module.exports = app => {
  app.use('/', router);
}
