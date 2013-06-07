/**
* node-mc Gruntfile
*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: '<json:package.json>',

        stylus: {
            compile: {
                compress: true,
                files: {
                    'public/css/main.css': 'styles/*.styl'
                }
            }
        },

        watch: {
            files: ['styles/*.styl'],
            tasks: ['stylus'],
            options: {
                nospawn: true,
                interrupt: true
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('assets', ['stylus']);
}
