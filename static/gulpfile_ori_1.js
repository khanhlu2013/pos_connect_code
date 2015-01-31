var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify');
var cdnizer = require("gulp-cdnizer");
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-minify-css');

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
    .pipe(gulp.dest('./dist'))
})

//concatinate pos_connect css
gulp.task('_concat_pos_connect_css',function(){
    return gulp.src([
        'css/**/*.css',
        'bower_components/angular-block-ui/dist/angular-block-ui.css'
    ])
    .pipe(concat('pos_connect.css'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('_minify_js',function() {
    return gulp.src('dist/product_app.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'))
});

gulp.task('_minify_css', function() {
    return gulp.src('dist/*.css')
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))        
        .pipe(gulp.dest('./dist'))
});

gulp.task('_cdnizer',function(){
    gulp.src("./../templates/product_app.html")
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
                file: '{{STATIC_URL}}dist/pos_connect.css',
                // test: 'xxx',
                cdn: '{{STATIC_URL}}dist/pos_connect.min.css'
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
            {
                file: '{{STATIC_URL}}dist/product_app.js',
                // test: 'xxx',{{STATIC_URL}}dist/product_app-12345678.js
                cdn: '{{STATIC_URL}}dist/product_app.min.js'
            }         
        ]))
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
            'dist/**',
            './../templates/dist/**'
        ], 
        {force:true},
        cb
    );
});

gulp.task('build',function(callback) {
    runSequence(
        '_clean',
        ['_concat_product_app_js', '_concat_pos_connect_css'],
        ['_minify_js','_minify_css'],
        '_cdnizer',
        callback
    );
});

//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

gulp.task('watch', function () {
    gulp.watch(['src/**/*.js','!src/app/sale_app/**/*.js'], ['_concat_product_app_js']);
    gulp.watch(['css/**/*.css'], ['_concat_pos_connect_css']);
})
