
var COS = require('cos-nodejs-sdk-v5');
var fs = require("fs");

var config = fs.readFileSync('../config/COS_config.json').toString('utf-8');
console.log(JSON.parse(config)['Bucket'])
// 创建实例
// var cos = new COS({
//     SecretId: 'AKIDN8iir2IgBIG3udrGG6Ypv6CuVv9CYAvS',
//     SecretKey: 'hsvoXqLijtQzNoCA6LkDapvLghXhnndd',
// });
// // 分片上传
// cos.sliceUploadFile({
//     Bucket: 'hexo-blog-1257698583', // Bucket 格式：test-1250000000
//     Region: 'ap-chengdu',
//     Key: '1.jpg',
//     FilePath: 'data/How to read a thesis.jpg'
// }, function (err, data) {
//     console.log(err, data);
// });
