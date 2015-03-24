//Gulp variables
var gulp   = require('gulp'),
    $      = require('gulp-load-plugins')(), //load all plugins
    watch  = require('gulp-watch'),
    path   = require('path');


//Path variables
var lessDir = './less',
    lessFiles = path.join(lessDir, '*', '**')
    lessMainFile = path.join(lessDir, 'main.less')
    cssDir = './css';

//LESS
gulp.task('less', function () {
  gulp.src(lessMainFile)
    .pipe($.less())
      .pipe($.autoprefixer())
      .pipe($.cssmin())
    
    .pipe($.rename({suffix: '.min'}))
    
    .pipe(gulp.dest(cssDir))
    .pipe($.livereload());
});

//Minify JS
// gulp.task('compress', function() {
//   gulp.src(['./www/js/admin.js', './www/js/home.js', './www/js/about.js'])
//     .pipe($.uglify())
//     .pipe($.rename({suffix: '.min'}))
//     .pipe(gulp.dest('./www/js/min'));
// });

//Minify SVG
// gulp.task('minifySVG', function() {
//     return gulp.src('./img/*.svg')
//         .pipe($.svgmin())
//         .pipe(gulp.dest('./img'));
// });

//Default
gulp.task('default', function() {

});

//Watch
gulp.task('watch', ['less'], function() {
  //Watch changes (less, )
  gulp.watch('less/**.less', ['less']);
  gulp.watch('less/**/*.less', ['less']);
});

