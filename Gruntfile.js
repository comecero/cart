module.exports = function (grunt) {

    /*  Load tasks  */
    require('load-grunt-tasks')(grunt);

    /*  Configure project  */
    grunt.initConfig({

        nggettext_extract: {
            pot: {
                files: {
                    '../cart/languages/template/template.pot': ['../cart/**/*.html', '../cart/app/**/*.html', '../cart/dist/js/kit.js', '../cart/app/**/*.js']
                }
            }
        },

        nggettext_compile: {
            all: {
                options: {
                    format: "json"
                },
                files: [
                    {
                        expand: true,
                        dot: true,
                        src: ["../cart/languages/**/*.po", "!../cart/languages/template/*"],
                        ext: ".json"
                    }
                ]
            },
        }

    });

    // Allows to update modified files only.
    grunt.loadNpmTasks('grunt-angular-gettext');

    /*  Register tasks  */
    grunt.registerTask('default', ['nggettext_extract', 'nggettext_compile']);

};