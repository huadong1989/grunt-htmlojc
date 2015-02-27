# grunt-htmlojc

> 优化html的js和css脚本，此工具的原理是合并html文件中的指定需要合并的文件并替换合并后的文件，新生成的文件以内容md5码进行命令，这样是为了控制浏览器加载文件的缓存，例子见example文件夹

## Getting Started
This plugin requires Grunt `~0.4.5`

* 本插件需要node和grunt环境  node安装环境参考node [官网](http://nodejs.org/)（http://nodejs.org/）
* grunt安装环境参考grunt [官网](http://www.gruntjs.net/)（http://www.gruntjs.net/）

```shell
npm install grunt-htmlojc --save-dev
```

安装好插件之后需要在您的 Gruntfile 文件中如下方式引用插件:

```js
grunt.loadNpmTasks('grunt-htmlojc');
```

## The "htmlojc" task

### Overview
In your project's Gruntfile, add a section named `htmlojc` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  htmlojc: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.banner
Type: `String`
Default value: `''`

优化后的文件开始注释

#### options.footer
Type: `String`
Default value: `''`

优化后的文件结尾注释


#### options.domain
Type: `String`
Default value: `''`

是上线后脚本的静态资源（CDN地址），默认为空.

#### options.rootPath
Type: `String`
Default value: `''`

工作目录，相对于Gruntfile.js文件，例如：
project  
-src  
--webapp  
---resource  
---WEB-INFO  
----...  
-Gruntfile.js  
此时rootPath为src/webapp

#### options.dest
Type: `String`
Default value: `'statics'`

优化后保存的文件目录，此目录是相对于rootPath的

### Usage Examples
```html
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<!--{{{-->
<link rel="stylesheet" type="text/css" href="css/base.css" />
<link rel="stylesheet" type="text/css" href="css/index.css" />
<!--}}}-->
</head>
<body>
这里是测试
<!--{{{-->
<script src="js/common.js" ></script>
<script src="css/index.js" ></script>
<!--}}}-->
</body>
```

```js
grunt.initConfig({
  htmlojc: {
     options: {
          domain:'',
          rootPath:'example',
          dest:'statics/release'
       },
       main:{
          files: [
            {
              src:'example/**/*.html'
            }
          ]
      }
  },
});
```

## Release History
_(Nothing yet)_
