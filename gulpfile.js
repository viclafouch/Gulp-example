const gulp = require('gulp'),
compass = require('gulp-compass'),
autoprefixer = require('gulp-autoprefixer'),
rename = require('gulp-rename'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
babel = require('gulp-babel'),
concat = require('gulp-concat'),
print = require('gulp-print'),
runSequence = require('run-sequence'),
fs = require('fs');

// Set true if you're in production
const inProduction = false;

runSequence.options.ignoreUndefinedTasks = true;

// Set your pathfiles
var assetsPath = '',
scssFilename = 'styles.scss',
jsPath = assetsPath+'js',
cssPath = assetsPath+'css',
scssPath = assetsPath+'scss',
imgPath = assetsPath+'img';

const pathLibJs = ['lib'];
const scriptFile = 'script.min.js';

var libJs = ['turbolinks'];

/*----------  Styles  ----------*/

fs.access(assetsPath+scssPath+'/'+scssFilename, fs.constants.R_OK | fs.constants.W_OK, (err) => {
	if (err) {
		fs.writeFile(scssPath+'/'+scssFilename, '@import "compass";', 'utf8');
	}
	runSequence('css');
});

gulp.task('css', function() {
	return gulp.src([scssPath+'/*.scss'])
		.pipe(compass({
		 	css: cssPath,
			sass: scssPath,
		}))
		.on('error', function(error) {
	      console.log(error);
	      this.emit('end');
	    })
	    .pipe(print(function(filepath) {
	      return "file created : " + filepath;
	    }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    	.pipe(gulp.dest(cssPath))
    	.pipe(rename({ suffix: '.min' }))
    	.pipe(cleanCSS({compatibility: 'ie8'}))
    	.pipe(gulp.dest(cssPath));
});

/*----------  Scripts  ----------*/

if (!inProduction) {
	gulp.task('myJs', function() {
		return gulp.src(assetsPath+jsPath+'/*.js')
			.pipe(sourcemaps.init())
	 		.pipe(babel({
	            presets: ['es2015']
	        }))
			.pipe(uglify().on('error', function(e){
		         console.log(e);
		    }))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest(assetsPath+jsPath+'/min'))

			.pipe(print(function(filepath) {
		      return "file created : " + filepath;
		    }))
	});
}

else {
	gulp.task('myJs', function() {
		return gulp.src(assetsPath+jsPath+'/*.js')
			.pipe(sourcemaps.init())
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest(assetsPath+jsPath+'/min'))

			.pipe(print(function(filepath) {
		      return "file created : " + filepath;
		    }))
	});
}

gulp.task('default', ['scripts']);


var scripts = [], x;
for (var i = 0; i < libJs.length; i++) {
	x = libJs[i];
	fs.access(pathLibJs+'/'+libJs[i], fs.constants.R_OK | fs.constants.W_OK, (err) => {
		if (err) {
			console.warn('Directory doesn\'t exist '+err.path);
		} else {
			scripts.push(pathLibJs+'/'+x+'/*.js');
		}
	});
}

scripts.push(assetsPath+jsPath+'/min/*.js');

gulp.task('concat__JS', function() {
  gulp.src(scripts)
    .pipe(concat(scriptFile))
    .pipe(gulp.dest(assetsPath+jsPath+'/min'));
});

gulp.task('scripts', function() {
	runSequence('myJs','concat__JS');
});

// /*----------  Live  ----------*/

// // Watch task
// gulp.task('watch', function() {
// 	gulp.watch('./assets/scss/*.scss', ['styles']);
// 	gulp.watch('./assets/js/*.js', ['scripts']);
// });