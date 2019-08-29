'use strict'

var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    minimist = require('minimist');

//默认任务
gulp.task('default', async () => {
    console.log('Gulp 默认任务');
    console.log('Gulp plugins: \n ', plugins);
});

// 清理发布目录
gulp.task('clean', () => {
    return gulp.src(['dist/*'], {
        read: false,
        buffer: false
    }).pipe(plugins.clean());
});


//压缩css
gulp.task('miniCss', () => {
    return gulp.src('css/**/*.css')
        .pipe(plugins.cleanCss({ compatibility: 'ie8' }))
        .pipe(plugins.rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/rev/css/'));
});

//压缩js
gulp.task('miniJs', (done) => {
    //页面资源JS
    gulp.src('js/**/*.js')
        // .pipe(plugins.jshint())
        // .pipe(plugins.jshint.reporter("default"))
        .pipe(plugins.stripDebug())
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(plugins.if('init.js', plugins.rev()))
        .pipe(gulp.dest('dist/js/'))
        .pipe(plugins.rev.manifest())
        .pipe(gulp.dest('dist/rev/js/'));

    //项目公共JS
    gulp.src('plugs/modules/**/*.js')
        // .pipe(plugins.jshint())
        // .pipe(plugins.jshint.reporter("default"))
        .pipe(plugins.stripDebug())
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/plugs/modules/'));

    done();
});

//压缩图片
gulp.task('miniImage', () => {
    return gulp.src('images/**/**')
        .pipe(plugins.cache(plugins.imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(gulp.dest('dist/images/'));
});

//压缩 HTML
gulp.task('miniHtml', () => {
    return gulp.src(["pages/**/*.html"])
        .pipe(plugins.htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest("dist/pages/"))
});

//复制项目资源文件
gulp.task('resource', (done) => {
    gulp.src('json/**/**')
        .pipe(plugins.jsonmin())
        .pipe(gulp.dest('dist/json/'));

    gulp.src('fonts/**/**')
        .pipe(gulp.dest('dist/fonts'));

    gulp.src(['plugs/**/**', '!plugs/modules/**'])
        .pipe(gulp.dest('dist/plugs/'));

    done();
});

//处理文件路径
gulp.task('rev', () => {
    return gulp.src(['dist/rev/**/*.json', 'dist/pages/**/*.html'])
        .pipe(plugins.revCollector())
        .pipe(gulp.dest('dist/pages/'));
});


//配置环境
gulp.task('configEnv', () => {
    var options = { string: 'env', default: { env: '' } };
    options = minimist(process.argv.slice(2), options);
    if (options.env == '')
        throw new Error('请输入环境参数');

    var confurl = '';
    if (options.env === 'dev') { //开发环境
        confurl = 'env/env.dev.js';
    }
    if (options.env === 'test') { //测试环境
        confurl = 'env/env.test.js';
    }
    if (options.env === 'staging') { //预发版环境
        confurl = 'env/env.staging.js';
    }
    if (options.env === 'prod') { //正式环境
        confurl = 'env/env.prod.js';
    }
    if (confurl == '')
        throw new Error('环境参数无效');

    return gulp.src(confurl)
        .pipe(plugins.concat('config.js'))
        .pipe(plugins.stripDebug())
        .pipe(plugins.babel())
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist/js/'));

});

//打包项目
gulp.task('build',
    gulp.series('clean',
        gulp.series('miniCss', 'miniJs', 'miniHtml', 'miniImage', 'resource',
            gulp.series('rev', 'configEnv', (done) => {
                done();
            })
        )
    )
);



// -------------------- dev ---------------------

//压缩css
gulp.task('devCss', () => {
    return gulp.src('css/**/*.css')
        .pipe(plugins.cleanCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest('dist/css'))
});


//压缩js
gulp.task('devJs', async () => {
    //页面资源JS
    var viewJs = gulp.src('js/**/*.js')
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist/js/'));
    //项目公共JS
    var unitJs = gulp.src('plugs/modules/**/*.js')
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist/plugs/modules/'));

    await plugins.merge(viewJs, unitJs);
});

//压缩 HTML
gulp.task('devHtml', () => {
    return gulp.src(["pages/**/*.html"])
        .pipe(gulp.dest("dist/pages/"));
});


//打包开发环境项目
gulp.task('devBuild',
    gulp.series('clean',
        gulp.parallel('devCss', 'devJs', 'devHtml', 'miniImage', 'resource',
            gulp.series('configEnv', (done) => {
                done();
            })
        )
    )
);

//看守
gulp.task('watch', () => {
    // 看守所有 css 样式
    gulp.watch('css/**/*.css', gulp.series('devCss'));
    // 看守所有.js
    gulp.watch(['js/**/*.js', 'plugs/modules/*.js'], gulp.series('devJs'));
    // 看守所有图片
    gulp.watch('images/**/**', gulp.series('miniImage'));
    // 看守所有页面
    gulp.watch('pages/**/**.html', gulp.series('devHtml'));
    // 看守 dist 下所有文件
    plugins.livereload.listen();
    gulp.watch(['dist/**/**']).on('change', (file) => {
        plugins.livereload.reload(file);
    });

});


//启动本地服务
gulp.task('server',
    gulp.series('devBuild',
        gulp.parallel('watch', () => {
            plugins.connect.server({
                root: 'dist', //根目录名，默认是gulpfile.js 所在文件夹
                port: 8090,
                livereload: true //是否自动重载
            });
        })
    )
);


