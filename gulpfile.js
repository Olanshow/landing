var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var rimraf = require('rimraf');
var rename = require('gulp-rename');

/*---------- Server ----------*/
gulp.task('server', function() {
	browserSync.init({
		server: {
			port:9000,
			baseDir: "build"
		}
	});


	gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*---------- Pug compile ----------*/
gulp.task('pug', function buildHTML() {
  return gulp.src('app/timplate/index.pug')
  .pipe(pug({
  	pretty: true
  }))
  .pipe(gulp.dest('build'))
});

/*---------- Sass compile ----------*/
gulp.task('sass', function () {
  return gulp.src('app/styles/main.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('build/css'));
});

/*---------- Sprite ----------*/
gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('app/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('build/images/'));
  spriteData.css.pipe(gulp.dest('app/styles/global/'));
  cb();
});

/*---------- Clean ----------*/
gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
});

/*---------- Copy fonts ----------*/
gulp.task('copy:fonts', function() {
	return gulp.src('./app/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

/*---------- Copy images ----------*/
gulp.task('copy:images', function() {
	return gulp.src('./app/images/**/*.*')
		.pipe(gulp.dest('build/images'));
});

/*---------- Copy ----------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/*---------- Watchers ----------*/
gulp.task('watch', function() {
	gulp.watch('app/timplate/**/*.pug', gulp.series('pug'));
	gulp.watch('app/styles/**/*.scss', gulp.series('sass'));
});

/*---------- Gulp Default ----------*/
gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('pug', 'sass', 'sprite', 'copy'),
	gulp.parallel('watch', 'server')
	)
);