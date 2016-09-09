var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var zip = require('gulp-zip');
var sequence = require("run-sequence");
var fs = require("fs");

gulp.task("concat-pages-js", function () {
    return gulp.src(["./app/pages/**/*.js"])
      .pipe(concat("pages.js"))
      .pipe(gulp.dest("./dist/js/"));
});

gulp.task("compress", function () {
    return gulp.src(["./dist/js/*.js", "!./dist/js/*.min.js"])
    .pipe(uglify())
     .pipe(rename({
        extname: ".min.js"
    }))
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task('sass', function () {
    gulp.src('./sass/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./sass/'));
});

gulp.task("sourcemap", function () {
    return gulp.src(["./dist/js/pages.js"])
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task('dist', function (done) {
    sequence('concat-pages-js', 'compress', 'sourcemap', 'sass', function () {
        done();
    });
});

gulp.task('zip', function (done) {

    // Read the version number
    var version = fs.readFileSync("./version.html", "utf8");

    return gulp.src(["./**", "!./.git", "!./.vs", "!./.git/*", "!./settings/**", "!./settings/", "!./.gitattributes", "!./.gitignore", "!./*.sln", "!./Web.config", "!./Web.Debug.config"])
    .pipe(zip("cart-" + version + ".zip"))
    .pipe(gulp.dest("./"));
});