var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sequence = require("run-sequence");

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