/**
* node-mc Gruntfile
*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',

        stylus: {
            compile: {
                compress: false
            },
            files: {
                'public/css/main.css':'styles/*.styl'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.registerTask('install-assets', ['stylus']);
}
