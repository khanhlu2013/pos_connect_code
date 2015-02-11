var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify');
var cdnizer = require("gulp-cdnizer");
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');
var rev = require('gulp-rev');
var inject = require("gulp-inject");
var awspublish = require('gulp-awspublish');
var process = require('child_process');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");

gulp.task('_partial_product_app',function(){
    return gulp.src([
        'src/**/*.html',
        '!src/app/sale_app/**/*.*'
    ])
    // .pipe(minifyHtml({
    //     empty: true,
    //     spare: true,
    //     quotes: true
    // }))
    .pipe(ngHtml2Js({
        moduleName: "app.product_app.partial",
        rename:function(url){
            url = url.replace(/\//g, '.');//replace file path '/' into '.'
            return url;
        }
    }))
    .pipe(concat("product_app.partial.min.js"))
    // .pipe(uglify())
    .pipe(gulp.dest("./dist"));
});

//concatinate product app js
gulp.task('_concat_product_app_js', function () {
    return gulp.src([
        'src/**/__init__.js',
        'src/**/*.js',
        'bower_components/angular-block-ui/dist/angular-block-ui.js',
        'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        '!src/app/sale_app'
    ])
    .pipe(concat('product_app.js'))
    .pipe(rev())   
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))     
    .pipe(gulp.dest('./dist'))
})

//concatinate pos_connect css
gulp.task('_concat_css',function(){
    return gulp.src([
        'css/**/*.css',
        'bower_components/angular-block-ui/dist/angular-block-ui.css'
    ])
    .pipe(concat('pos_connect.css'))
    .pipe(rev())    
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))          
    .pipe(gulp.dest('./dist'))
})

gulp.task('build_product_app_local', ['_partial_product_app'],function () {
    var target = gulp.src('./../templates/product_app.html');
    var sources = gulp.src([
        './bower_components/angular-block-ui/dist/angular-block-ui.js',
        './bower_components/angular-block-ui/dist/angular-block-ui.css',
        './bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
        'src/**/__init__.js',
        'src/**/*.js',
        'dist/product_app.partial.min.js',        
        'css/**/*.css',        
        '!src/app/sale_app/**/*.*'        
    ], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/local'))
});

gulp.task('_inject_resource_to_product_html_deploy', function () {
    var target = gulp.src('./../templates/product_app.html');
    var sources = gulp.src(['./dist/*.min.*'], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }     
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(gulp.dest('./../templates/dist/deploy'))
});

gulp.task('_cdnizer_product_app',function(){
    return gulp.src("./../templates/dist/deploy/product_app.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap.min.css'
            },      
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap-theme.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap-theme.min.css'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular/angular.js',
                package: 'angular',
                test: 'window.angular',
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
            },
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jQuery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                package: 'angular-bootstrap',
                // test: 'xxx',
                cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/${ version }/ui-bootstrap-tpls.min.js'
            },        
        ]))
        .pipe(gulp.dest("./../templates/dist/deploy"));    
})
gulp.task('_cdnizer_login_page',function(){
    return gulp.src("./../templates/login.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap.min.css'
            },      
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/css/bootstrap-theme.css',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/css/bootstrap-theme.min.css'
            },             
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jQuery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/js/bootstrap.js',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/js/bootstrap.min.js'
            }         
        ]))
        .pipe(gulp.dest("./../templates/dist"));            
});
gulp.task('_clean', function () {
    return del.sync(
        [
            'dist',
            './../templates/dist'
        ], 
        {force:true}
    );
});
gulp.task('build_dist',function(cb) {
    runSequence(
        '_clean',
        ['_concat_product_app_js', '_concat_css'],
        ['_inject_resource_to_product_html_deploy'],
        ['_cdnizer_product_app', '_cdnizer_login_page'],
        cb
    );
}); 
gulp.task('upload_s3', function() {
    var publisher = awspublish.create({ bucket: 'pos-connect-test' });
    var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
    return gulp.src('./dist/*.min.*')
        .pipe(publisher.publish(headers))// publisher will add Content-Length, Content-Type and headers specified above If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.cache())// create a cache file to speed up consecutive uploads
        .pipe(awspublish.reporter());// print upload updates to console
});
gulp.task('watch',['build_product_app_local'],function () {
    gulp.watch([
        'css/**/*.css',
        'src/**/*.js',
        'src/**/*.html',
        '!src/app/sale_app/**/*.*',
        './../templates/product_app.html'
    ],
    ['build_product_app_local']);
});
gulp.task('dev', function(){
    var django_process = process.spawn;
    var PIPE = {stdio: 'inherit'};
    django_process('foreman', ['start','--procfile','./../Procfile_local','--env','./../.env'], PIPE);

    var couchdb_process = process.spawn;
    var PIPE = {stdio: 'inherit'};
    couchdb_process('couchdb', [], PIPE);    

    // var watch_process = process.spawn;
    // var PIPE = {stdio: 'inherit'};
    // watch_process('gulp', ['watch'], PIPE);       
});

