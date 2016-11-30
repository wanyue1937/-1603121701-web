// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var tasklisting = require('gulp-task-listing'); //打印出所有任务
var rename = require('gulp-rename');
var jshint = require('gulp-jshint'); //js代码校验
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //js压缩
var minifycss = require('gulp-clean-css'); //css压缩
var imagemin = require('gulp-imagemin');  //图片压缩
var spritesmith = require('gulp.spritesmith'); //雪碧图合并
var inlinesource = require('gulp-inline-source');  //资源内联
var include=require('gulp-include'); //资源内联（主要是html片段)
var connect = require('gulp-connect');//刷新
// js代码校验
gulp.task('lint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并，压缩js
gulp.task('scripts', function() {
    gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});
//合并压缩css
gulp.task('css', function() {
    gulp.src('./src/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist'));
});
//合并雪碧图
gulp.task('sprite', function () {
    return gulp.src('src/images/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite.png',//保存合并后图片的地址
            cssName: 'css/sprite.css',//保存合并后对于css样式的地址
            padding:5,//合并时两个图片的间距
            algorithm: 'binary-tree',//注释1
            cssTemplate:"css/handlebarsStr.css"//注释2
        }))
        .pipe(gulp.dest('dist/'));
});
//资源内联
gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(inline())//把js内联到html中
        .pipe(include())//把html片段内联到html主文件中
        .pipe(useref())//根据标记的块  合并js或者css
        .pipe(gulpif('*.js',uglify()))
        .pipe(gulpif('*.css',mincss()))
        .pipe(connect.reload()) //重新构建后自动刷新页面
        .pipe(gulp.dest('dist'));
});

//服务器刷新
gulp.task('webconnect',function(){
    connect.server({
        root:'./',  
        ip:'192.168.31.110',
        livereload:true
    });

});
//打印出所有的task
gulp.task('tasklisting',['help']);
gulp.task('help',tasklisting);

// 默认任务
gulp.task('default', function(){
    gulp.run('lint',  'scripts','sprite','tasklisting');

    // 监听文件变化
    gulp.watch('./src/js/*.js', function(){
        gulp.run('lint', 'scripts');
    });
    gulp.watch('./src/css/*.css', function(){
        gulp.run('css');
    });
    gulp.watch('src/images/*.png', function(){
        gulp.run('sprite');
    });
    gulp.watch('src/*.html', function(){
        gulp.run('webconnect');
    });
});


// var gulp=require('gulp');
// gulp.task('default',function(){
//     console.log('hello world');

// });





























