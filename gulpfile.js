const gulp = require('gulp');
const browserSync = require('browser-sync').create();

function css() {
    return gulp
      .src('./assets/**/*.css') 
      .pipe(browserSync.stream());
}


function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })

    gulp.watch('./assets/**/*.css', css);
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./assets/**/*.js').on('change', browserSync.reload);
}

exports.css = css;
exports.watch = watch;