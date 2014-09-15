'use strict';

var url = require('url');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');


module.exports = function(opt) {

  opt = opt || {};
  var ext = opt.ext || '.ejs';
  var config = opt.ejs || {};
  var baseDir = opt.baseDir || __dirname;

  return function(req, res, next) {
    var file = req.url === '/' ? ('/index' + ext) : req.url;
    var pathname = path.join(baseDir, url.parse(file).pathname);

    if (path.extname(pathname) === ext && fs.existsSync(pathname)) {

      var contents = fs.readFileSync(pathname).toString();

      config.query = url.parse(req.url, true).query;
      config.filename = pathname;

      contents = ejs.render(contents, config);

      if (opt.browserSync) {
        if(opt.browserSync === true){
          opt.browserSync = '1.4.0';
        }
        contents = contents.replace(/<\/head>/, '<script async src="//' + req.headers.host + '/browser-sync-client.' + opt.browserSync + '.js"></script></head>');
      }

      res.write(contents);

      res.end();
    } else {
      next();
    }
  };
};
