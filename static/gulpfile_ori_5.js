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
    .pipe(gulp.dest('./dist'))
})

gulp.task('_minify_product_app_js',function() {
    return gulp.src('dist/product_app-????????.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'))
});

gulp.task('_minify_css', function() {
    return gulp.src('dist/*-????????.css')
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))        
        .pipe(gulp.dest('./dist'))
});

gulp.task('_inject_resource_to_product_html_local', function () {
    var target = gulp.src('./../templates/product_app.html');
    var sources = gulp.src(['./dist/*.*','!./dist/*.min.*'], {read: false/*It's not necessary to read the files (will speed up things), we're only after their paths:*/});
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
})
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
        ['_minify_product_app_js', '_minify_css'],
        ['_inject_resource_to_product_html_deploy'],
        ['_cdnizer_product_app', '_cdnizer_login_page'],
        cb
    );
}); 
gulp.task('build_local',function(cb) {
    runSequence(
        '_clean',
        ['_concat_product_app_js', '_concat_css'],
        ['_inject_resource_to_product_html_local'],
        cb
    );
}); 
gulp.task('build',function(cb) {
    runSequence(
        '_clean',
        ['_concat_product_app_js', '_concat_css'],
        ['_minify_product_app_js', '_minify_css'],
        ['_inject_resource_to_product_html_local', '_inject_resource_to_product_html_deploy'],
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
gulp.task('watch', function () {
    gulp.watch(['src/**/*.js','!src/app/sale_app/**/*.js'], ['build_local']);
    gulp.watch(['css/**/*.css'], ['build_local']);
})

