/*
 * grunt-htmlojc
 * https://github.com/huadong1989/grunt-htmlojc
 *
 * Copyright (c) 2015 hadon
 * Licensed under the MIT license.
 */

'use strict';

var CleanCSS = require('clean-css');
var UglifyJs = require("uglify-js");
var utils = require("./lib/utils.js");
var path = require('path');

//regex
var JSTARGETSECTIONREGEXP =  /<!--\s*{{{\s*-->[\n\r\s]*((<script[^>]*src=['|"]([^>]+)['|"][^>]*>[\s\S]*?<\/script>)+)[\n\r\s]*<!--\s*}}}\s*-->/gm;
var JSREGEXP = /<script[^>]*src=['|"]([^>]+)['|"][^>]*>[\s\S]*?<\/script>/gm;
var CSSTARGETSECTION = /<!--\s*{{{\s*-->[\n\r\s]*((<link[^>]*href=['|"]([^>]+)['|"][^>]*>[\n\r\s]*)+)[\n\r\s]*<!--\s*}}}\s*-->/gm;
var CSSREGEXP = /<link[^>]*href=['|"]([^>]+)['|"][^>]*>/gm;
/**
* 扩展方法
*/
Array.prototype.indexOf=function(value){
  for(var i=0,l=this.length;i<l;i++){
    if(this[i]==value){
      return i;
    }
  }
  return -1;
}

module.exports = function(grunt) {
  
  /**
  * handler script code
  * min and compressor
  * @param m1 select section
  * @param type js/css
  */
  var handlerCode = function(mapJson,options,m1,type){
      var scrptRegExp = type == "js"?JSREGEXP:CSSREGEXP;

      var  srcArr = m1.toString().match(scrptRegExp),allScript = [];

      //get all source
      for (var i = 0; i < srcArr.length; i++) {
        var script = srcArr[i];
        script.match(scrptRegExp);
        var file = RegExp.$1,absolutePath = '';
        if(file.indexOf("/")==0){
            absolutePath = options.rootPath+file;
        }else{
            absolutePath = options.rootPath+"/"+file;
        }
        var code = grunt.file.read(absolutePath);

        var result,opCode='';
        try {
          if(type == "js"){
              //Compressor js code
              result = UglifyJs.minify(code,{fromString: true});
              opCode = result.code+"\n";
          }else{
              //Compressor css code
              var cssMinify = new CleanCSS({advanced:true});
              var min = cssMinify.minify(code);
              opCode = min.styles+"\n";
          }
         
          allScript.push(opCode);

        } catch (e) {
          console.log(e);
        }
      }

      var finalCode = allScript.join('');
      var codeMd5 = utils.md5(finalCode,32);
      var fileName = codeMd5.substring(0,7)+"."+type;
      var mFileMap = mapJson[fileName];
      var absoluteFilePath = options.rootPath+"/"+options.dest+"/"+type+"/";

      options.domain = options.domain!=""?(options.domain.lastIndexOf("/")==0?options.domain:options.domain+"/"):"";

      var replaceStr = '<script src="'+options.domain+options.dest+'/'+type+'/'+fileName+'"></scrpt>';
      if(typeof mFileMap != 'undefined'){
          if(mFileMap.md5 && mFileMap.md5 == codeMd5){
              return replaceStr;
          }
       }
       mapJson[fileName] = {md5:codeMd5};
       grunt.file.write(absoluteFilePath+fileName, finalCode);

       grunt.log.debug(replaceStr);
       return replaceStr;
  };
  
  grunt.registerMultiTask('htmlojc', 'compression html’s js and css script', function() {

    // Merge task-specific and/or target-specific options with these defaults
    var options = this.options({
        domain:'',
        rootPath:'',
        dest:'statics',
        banner: '',
        footer: ''
    });
    // fileName's content md5
    var mapJson = {};
    if(grunt.file.exists("map.json")){
       mapJson = utils.mapJson("map.json");
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        return true;
      }).map(function(filepath) {
        // Read file source.
        var data = grunt.file.read(filepath);

        //grunt.log.debug(data);

        /**
         * replace js
         * o $1 $2 $3 position
         */
        var data = data.replace(JSTARGETSECTIONREGEXP,function(o,m1,m2,m3,m4){
               return handlerCode(mapJson,options,m1,"js");
        });

        /**
         * replace css
         * o $1 $2 $3 position
         */
        var data = data.replace(CSSTARGETSECTION,function(o,m1,m2,m3,m4){
              return handlerCode(mapJson,options,m1,"css");
        });

        grunt.file.write(filepath,data);
        return ;
      });
    });

    //save map source
    var mapJsonInfo = JSON.stringify(mapJson);
    grunt.file.write("map.json",mapJsonInfo);

  });
  //end task register

};
