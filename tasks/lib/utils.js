'use strict';

var fs = require('fs');
var crypto = require('crypto');

/**
 * map to json
 * @param mapFileName
 * {filepath:{md5:**}}
 */
exports.mapJson = function(mapFileName){
	var mapInfo = fs.readFileSync(mapFileName, 'utf8');
	if(mapInfo){
		return JSON.parse(mapInfo);
	}
	return {};
};

/**
 * create md5
 * @param data content
 * @param len md5 length
 */
exports.md5 = function(data, len){
	var md5sum = crypto.createHash('md5'),
        encoding = typeof data === 'string' ? 'utf8' : 'binary';
    md5sum.update(data, encoding);
    len = len || 7;
    return md5sum.digest('hex').substring(0, len);
};

