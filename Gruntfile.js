module.exports = function(grunt) {
    // 构建任务配置
    "use strict";

     // 自动加载 grunt 任务
    require('load-grunt-tasks')(grunt);

    // 统计 grunt 任务耗时
    //require('time-grunt')(grunt);

    var config=
    {
        src:"src",
        dest:"dest",
        wap:"wap"
    };
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        config:config,
        //压缩js文件。
        uglify: {
            //文件头部输出信息
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            //具体任务配置
            // builda: {//任务一：压缩a.js，不混淆变量名，保留注释，添加banner和footer
            //     options: {
            //         mangle: false, //不混淆变量名
            //         preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            //         footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
            //     },
            //     files: {
            //         'output/js/a.min.js': ['js/a.js']
            //     }
            // },
            // buildb:{//任务二：压缩b.js，输出压缩信息
            //     options: {
            //         report: "min"//输出压缩率，可选的值有 false(不输出信息)，gzip
            //     },
            //     files: {
            //         'output/js/b.min.js': ['js/main/b.js']
            //     }
            // },
            buildall: {//任务三：按原文件结构压缩js文件夹内所有JS文件
                options: {
                    mangle: false, //不混淆变量名
                    preserveComments: 'all', //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                    footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
                },
                files: [{
                    expand:true,
                    cwd:'<%= config.wap %>/js',//js目录下
                    src:'**/*.js',//所有js文件
                    dest: '<%= config.wap %>/js',//输出到此目录下
                    ext:".js"//文件后缀名。
                }]
            }
            // release: {//任务四：合并压缩a.js和b.js
            //     files: {
            //         'output/js/index.min.js': ['js/a.js', 'js/main/b.js']
            //     }
            // }
        },
        //检测js文件。
        jshint:
        {
            files:['Gruntfile.js','<%= config.dest %>/js/**/*.js'],
            options:
            {
                //允许多行字符串拼接，在，*.tpl中常用。
                "multistr":true,
                //允许使用类似这钟表达式，$.isFunction( fn ) && fn();
                "expr":true,
                // 允许使用类似这种函数  new Function("obj","return 123")
                "evil":true
            }
        },
        autoprefixer: 
        {
            options: {
               // diff: false,
                browsers: ['ios 5', 'android 2.3']
            },
            // prefix all files
            multiple_files:
            {
               // expand: true,
                src: ['src/css/**/*.css']
            } 
        },
        //复制。
        copy: {
            yiigoo:
            {
                files:[
                {
                    expand:true,
                    cwd:"<%= config.src %>/css",
                    src:"**/*.*",
                    dest:"<%= config.dest %>/css"
                },
                {
                    expand:true,
                    cwd:"<%= config.src %>/font",
                    src:"**/*.*",
                    dest:"<%= config.dest %>/font"
                },
                {
                    expand:true,
                    cwd:"<%= config.src %>/images",
                    src:"**/*.*",
                    dest:"<%= config.dest %>/images"
                },
                {
                    expand:true,
                    cwd:"<%= config.src %>/lib",
                    src:"**/*.*",
                    dest:"<%= config.dest %>/lib"
                }]
            },
            yiigoo_wap:
            {
                files:[
                {
                    expand:true,
                    cwd:"<%= config.dest %>",
                    src:"**/*.*",
                    dest:"<%= config.wap %>"
                }]
            }
            //拷贝html文件
            // html:
            // {
            //     expand:true,
            //     cwd:"src",
            //     src:"**/*.html",
            //     dest:"dest"
            // },
            // framework:
            // {
            //     expand:true,
            //     cwd:"src/framework",
            //     src:"**/*.*",
            //     dest:"dest/framework"
            // }
        },
        clean:
        {
            dist:
            {
                // src:["<%= config.dist %>/index.html","<%= config.dist %>/js/common.js"]
                src:["<%= config.wap %>/framework/**/*"],
                // filter:"isfile" //过滤文件件。
                // filter:function(filepath)
                // {
                //     return (!grunt.file.isDir(filepath));
                // }
            }
        },
        //css压缩。
        cssmin:
        {
            target: 
            {
                files: [{
                  expand: true,
                  cwd: '<%= config.wap %>/css',
                  src: ['**/*.css', '!*.min.css'],
                  dest:'<%= config.wap %>/css',
                  ext: '.css'
                }]
            }
        },
        imagemin: 
        {
            /* 压缩图片大小 */
            dist: 
            {
                options: 
                { 
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [
                {
                    expand: true,
                    cwd: '<%= config.wap %>/images',
                    src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
                    dest: '<%= config.wap %>/images' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                    // ext:".min"
                }]
            }
        },
        connect: 
        {
            server: {
                options: {
                    open: true, //自动打开网页 http://
                    protocol: 'http',
                    port: 9000,
                    hostname: '*',
                    keepalive: true,
                    livereload:35729,
                    base: ['dest/']
                }
            }
           
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },

                files: [  //下面文件的改变就会实时刷新网页
                    'dest/*.html',
                    'dest/css/{,*/}*.css',
                    'dest/js/{,*/}*.js',
                    'dest/images/{,*/}*.{png,jpg}'
                ]
            }
        }
    }); 
    grunt.registerTask('wap_clean', ['clean',"cssmin","imagemin","uglify"]);
    grunt.registerTask('dev', ['copy:yiigoo']);
    grunt.registerTask('wap', ['copy:yiigoo_wap']);
    // 默认执行的任务
    grunt.registerTask('default', ['copy']);
};