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

//concatinate product app js
gulp.task('_build_product_app_js', function () {
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
gulp.task('_build_pos_connect_css',function(){
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

gulp.task('_inject_resource_to_index', function () {
    var target = gulp.src('./../templates/product_app.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths: 
    var transform = function (filepath, file, i, length) {
        filepath = '{{STATIC_URL}}' + filepath.substr(1);
        return inject.transform.apply(inject.transform, arguments);
    }    
    var sources = gulp.src(['./dist/*.*'], {read: false});
 
    return target
        .pipe(inject(sources,{transform:transform}))
        .pipe(rename({suffix: '.no_cdn'}))
        .pipe(gulp.dest('./../templates/dist'))
});

gulp.task('_cdnizer',function(){
    gulp.src("./../templates/dist/product_app.no_cdn.html")
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
        .pipe(rename('product_app.yes_cdn.html'))
        .pipe(gulp.dest("./../templates/dist"));    

    gulp.src("./../templates/login.html")
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

gulp.task('_clean', function (cb) {
    del(
        [
            'dist',
            './../templates/dist'
        ], 
        {force:true},
        cb
    );
});

gulp.task('build',function(callback) {
    runSequence(
        '_clean',
        ['_build_product_app_js', '_build_pos_connect_css'],
        '_inject_resource_to_index',
        '_cdnizer',
        callback
    );
});

//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js','!src/app/sale_app/**/*.js'], ['_build_product_app_js']);
    gulp.watch(['css/**/*.css'], ['_build_pos_connect_css']);
})
