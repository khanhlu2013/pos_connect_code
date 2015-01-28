var gulp = require('gulp');


var concat = require('gulp-concat')
gulp.task('js', function () {
    gulp.src(['src/**/__init__.js', 'src/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('.'))
})


gulp.task('watch', ['js'], function () {
    gulp.watch('src/**/*.js', ['js'])
})


var cdnizer = require("gulp-cdnizer");
gulp.task('cdnizer',function(){
    gulp.src("./../templates/product_app.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/angular/angular.js',
                package: 'angular',
                test: 'window.angular',
                cdn: 'https://ajax.googleapis.com/ajax/libs/angularjs/${ version }/angular.min.js'
            },
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jquery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                package: 'angular-bootstrap',
                // test: 'window.angular-bootstrap',
                cdn: '//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/${ version }/ui-bootstrap-tpls.min.js'
            },         
        ]))
        .pipe(gulp.dest("./../templates/dist"));    

    gulp.src("./../templates/login.html")
        .pipe(cdnizer([
            {
                file: '{{STATIC_URL}}bower_components/jquery/dist/jquery.js',
                package: 'jquery',
                test: 'window.jquery',
                cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ version }/jquery.min.js'
            },        
            {
                file: '{{STATIC_URL}}bower_components/bootstrap/dist/js/bootstrap.js',
                package: 'bootstrap',
                // test: 'xxx',
                cdn: 'https://maxcdn.bootstrapcdn.com/bootstrap/${ version }/js/bootstrap.min.js'
            },         
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
        ]))
        .pipe(gulp.dest("./../templates/dist"));            
})
