'use strict';
/*
 * vinyl-ftp-branch
 * https://github.com/ch4feel/vinyl-ftp-branch
 *
 * Copyright (c) 2015 ch4feel
 * Licensed under the MIT license.
 */
var gutil = require('gulp-util');
var assign = require('object-assign');
var fs = require('fs');

module.exports = function (options) {
    options = assign({}, options);
    options.userKeyFile = options.userKeyFile || '.ftppass';
    options.userKey = options.userKey || 'key1';

    if(fs.accessSync('.git/HEAD', fs.R_OK)) {
        throw new gutil.PluginError('vinyl-ftp-branch', 'Git repository required');
    }

    if(fs.accessSync(options.userKeyFile , fs.R_OK)) {
        throw new gutil.PluginError('vinyl-ftp-branch', 'User key file not exists');
    }

    var ftppass = eval('['+fs.readFileSync(options.userKeyFile).toString().trim()+']')[0];
    var branchData = fs.readFileSync('.git/HEAD').toString().trim();
    var branchName = branchData.substring(branchData.lastIndexOf('refs/heads/') + 11);
    var remotePath = options.remotePath + '/' || '/';

    if(options.log == true)
        options.log = gutil.log;

    options.finalRemotePath = remotePath + branchName;
    options.user = eval('ftppass.'+ options.userKey + '.username');
    options.pass = eval('ftppass.'+ options.userKey + '.password');

    delete options.remotePath;
    delete options.userKey;
    delete options.userKeyFile;

    gutil.log('connecting FTP server', gutil.colors.green(options.host), 'with', gutil.colors.green(options.user));
    gutil.log('uploading branch', gutil.colors.blue(branchName), 'to', gutil.colors.blue(options.finalRemotePath));

    return options;
}