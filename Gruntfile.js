module.exports = function (grunt) {

    /*

    Use the tasks below to export strings that are marked for translation from the app, and import translated strings back into the app.
    The app uses angular-gettext to provide the export, import and on-the-fly translation functions. https://angular-gettext.rocketeer.be/
    Follow the guide on the angular-gettext website to learn how to mark a string for translation.

    To use the tool
    - Install grunt and angular-gettext, as per package.json

    To export strings for translation:
    - From the root of the app, run grunt nggettext_extract
    - This will create a file located in languages/temple/template.po that indicates all of the strings that need to be translated. Have this file translated for each language.

    To import strings that have been translated
    - Copy the .po file for each language into the respectve folder in languages/language-code/language-code.po
      - For example, the Russian translation should be located in languaged/ru/ru.po
    - After all .po files have been copied into each language folder, from the root of the app, run grunt nggettext_compile.
      - This takes all of the translated strings and copies them into .json files that are used by the app to provide translations.

    To add support for a new language
    - Create a new folder for the language under languages/language-code, for example, languages/ru for Russian.
    - Have the template.po file translated into that language.
    - Import the translated strings, as per the above section.
    - Update $rootScope.languages in app/app.js with the language name and code

    */


    /*  Load tasks  */
    require('load-grunt-tasks')(grunt);

    /*  Configure project  */
    grunt.initConfig({

        nggettext_extract: {
            pot: {
                files: {
                    './languages/template/template.po': ['./*.html', './**/app/**/*.html', './dist/js/kit.js', './app/**/*.js', '!./node_modules/**']
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
                        src: ["./languages/**/*.po", "!./languages/template/*"],
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