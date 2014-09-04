'use strict';

var url = require('url');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');


module.exports = function(opt) {

  opt = opt || {};
  var ext = opt.ext || 'ejs';
  var config = opt.ejs || {};
  var baseDir = opt.baseDir || __dirname;

  return function(req, res, next) {
    var file = req.url === '/' ? ('/index.' + ext) : req.url;
    var pathname = path.join(baseDir, url.parse(file).pathname);

    if (pathname.indexOf(ext) > -1 && fs.existsSync(pathname)) {
      var contents = fs.readFileSync(pathname).toString();

      config.query = url.parse(req.url, true).query;
      config.filename = pathname;

      contents = ejs.render(contents, config);

      if (opt.browserSync) {
        contents = contents.replace(/<\/head>/, '<script async src="//' + req.headers.host + '/browser-sync-client.1.3.6.js"></script></head>');
      }

      res.write(contents);

      res.end();
    } else {
      next();
    }
  };
};
