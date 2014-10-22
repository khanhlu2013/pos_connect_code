module.exports = function(grunt){
    grunt.initConfig({
        pgk:grunt.file.readJSON('package.json'),
        banner: '/* banner: <%=pkg.name=%> */',
        jshint:{
            option:{
                curly:true,
                eqeqeq:true,
                undef:true,
                eqnull:true,
            },
            gruntfile : {
                src: 'Gruntfile.js'
            }
        }

    })
}