﻿var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sequence = require("gulp4-run-sequence");
var fs = require("fs");
var header = require('gulp-header');

gulp.task("concat-pages-js", function (done) {
    return gulp.src(["./app/shared/**/*.js", "./app/pages/**/*.js"])
      .pipe(concat("pages.js"))
      .pipe(gulp.dest("./dist/js/"));
    done();
});

gulp.task("compress", function (done) {
    return gulp.src(["./dist/js/*.js", "!./dist/js/*.min.js", "!./dist/js/kit.js"])
    .pipe(uglify())
     .pipe(rename({
         extname: ".min.js"
     }))
    .pipe(gulp.dest("./dist/js/"));
    done();
});

gulp.task('sass', function (done) {
    gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./sass/'));
    done();
});

gulp.task("sourcemap", function (done) {
    return gulp.src(["./dist/js/pages.js"])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./dist/js/"));
    done();
});

gulp.task('dist', function (done) {
    sequence('concat-pages-js', 'compress', 'sourcemap', 'sass', function () {

        // Read the version number
        var version = fs.readFileSync("./version.html", "utf8");

        // Add headers with the release number to each of the distribution files.
        gulp.src(['./dist/js/pages.js', './dist/js/pages.min.js']).pipe(header("/*\nComecero Cart version: " + version + "\nhttps://comecero.com\nhttps://github.com/comecero/cart\nCopyright Comecero and other contributors. Released under MIT license. See LICENSE for details.\n*/\n\n")).pipe(gulp.dest('./dist/js/'));
        done();
    });
});

gulp.task('copy-settings', function (done) {

    // Copy the settings files from the samples to valid files for testing. If you provide an account_id, it will update the files with the supplied account_id. You can also provide an api host if you are targeting a non-production API environment.
    // gulp copy-settings --account_id AA1111 --api_host api-dev.comecero.com

    // Get the account_id, if supplied.
    var account_id = "AA0000", i = process.argv.indexOf("--account_id");
    if (i > -1) {
        account_id = process.argv[i + 1];
    }

    var api_host = "api.comecero.com", i = process.argv.indexOf("--api_host");
    if (i > -1) {
        api_host = process.argv[i + 1];
    }

    fs.readFile("./settings/account-SAMPLE.js", "utf-8", function (err, data) {

        // Remove the comments from the top of the file
        data = removeHeaderLines(data, 2);

        data = data.replace("AA0000", account_id);
        data = data.replace("api.comecero.com", api_host);
        fs.writeFile("./settings/account.js", data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    fs.readFile("./settings/app-SAMPLE.js", "utf-8", function (err, data) {

        // Remove the comments from the top of the file
        data = removeHeaderLines(data, 2);

        data = data.replace("AA0000", account_id);
        data = data.replace("api.comecero.com", api_host);
        fs.writeFile("./settings/app.js", data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    fs.readFile("./settings/style-SAMPLE.js", "utf-8", function (err, data) {

        // Remove the comments from the top of the file
        data = removeHeaderLines(data, 3);

        data = data.replace("AA0000", account_id);
        data = data.replace("api.comecero.com", api_host);
        fs.writeFile("./settings/style.js", data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    fs.readFile("./settings/script-SAMPLE.js", "utf-8", function (err, data) {

        // Remove the comments from the top of the file
        data = removeHeaderLines(data, 2);

        // Add a comment
        data = "// This contains any custom JavaScript provided by the user.\n\n" + data;

        fs.writeFile("./settings/script.js", data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

    fs.readFile("./settings/style-SAMPLE.css", "utf-8", function (err, data) {

        // Remove the comments from the top of the file
        data = removeHeaderLines(data, 2);

        // Add a comment
        data = "/* This contains any custom CSS provided by the user.*/\n\n" + data;

        fs.writeFile("./settings/style.css", data, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }
        });
    });

});

function removeHeaderLines(text, numberOfLines) {
    var lines = text.split('\n');
    lines.splice(0, numberOfLines);
    return lines.join('\n');
}