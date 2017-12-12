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
fs = require('fs'),
mkdirp = require('mkdirp');

runSequence.options.ignoreUndefinedTasks = true;

// Set true if you're in production
const inProduction = false;

// Need Turbolinks ?
var turbolinks = false;

// Your JS lib
var libJs = [];

// Your assets folder path
var assetsPath = 'assets';

// Your lib folder's name;
const libName = 'lib';

// Your lib path;
const pathLibJs = '';

// Your assets folder's name
const jsFolder = 'js';
const cssFolder = 'css';
const scssFolder = 'scss';
const imgFolder = 'img';

/*=====  End of Configuration  ======*/

// Instance path folder
const jsPath = assetsPath+'/'+jsFolder;
const cssPath = assetsPath+'/'+cssFolder;
const scssPath = assetsPath+'/'+scssFolder;
const imgPath = assetsPath+'/'+imgFolder;

const paths = [jsPath, cssPath, scssPath, imgPath];

// Verif if user check turbolinks
if (turbolinks) {
	libJs = ['turbolinks'];
}

// Creat assets' folder
mkdirp(assetsPath, function(err) { 
    console.log(err);
});

// Creat subFolders to assets folder
for (var i = paths.length - 1; i >= 0; i--) {
	mkdirp(paths[i], function(err) { 
	});
}


if (fs.existsSync(scssPath+'/styles.scss')) {
    // Do something
} else {
	fs.writeFile(scssPath+'/styles.scss', "", function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

/*=====  Gulp  ======*/

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

// /*----------  Scripts  ----------*/

// if (!inProduction) {
// 	gulp.task('myJs', function() {
// 		return gulp.src(assetsPath+jsPath+'/*.js')
// 			.pipe(sourcemaps.init())
// 	 		.pipe(babel({
// 	            presets: ['es2015']
// 	        }))
// 			.pipe(uglify().on('error', function(e){
// 		         console.log(e);
// 		    }))
// 			.pipe(rename({ suffix: '.min' }))
// 			.pipe(gulp.dest(assetsPath+jsPath+'/min'))

// 			.pipe(print(function(filepath) {
// 		      return "file created : " + filepath;
// 		    }))
// 	});
// }

// else {
// 	gulp.task('myJs', function() {
// 		return gulp.src(assetsPath+jsPath+'/*.js')
// 			.pipe(sourcemaps.init())
// 			.pipe(rename({ suffix: '.min' }))
// 			.pipe(gulp.dest(assetsPath+jsPath+'/min'))

// 			.pipe(print(function(filepath) {
// 		      return "file created : " + filepath;
// 		    }))
// 	});
// }

// var scripts = [], x;
// for (var i = 0; i < libJs.length; i++) {
// 	x = libJs[i];
// 	fs.access(pathLibJs+'/'+libJs[i], fs.constants.R_OK | fs.constants.W_OK, (err) => {
// 		if (err) {
// 			console.warn('Directory doesn\'t exist '+err.path);
// 		} else {
// 			scripts.push(pathLibJs+'/'+x+'/*.js');
// 		}

// 		if (i == libJs.length) {
// 			scripts.push(assetsPath+jsPath+'/min/*.js');
// 		}
// 	});
// }

// gulp.task('concat__JS', function() {
//   gulp.src(scripts)
//     .pipe(concat(scriptFile))
//     .pipe(gulp.dest(assetsPath+jsPath+'/min'));
// });

// gulp.task('scripts', function() {
// 	runSequence('myJs','concat__JS');
// });

gulp.task('watch', function() {
	gulp.watch(scssPath+'/*.scss', ['css']);
	gulp.watch(jsPath+'/*.js', ['scripts']);
});

gulp.task('default', ['css', 'watch']);