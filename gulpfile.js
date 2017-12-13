const gulp = require('gulp'),
compass = require('gulp-compass'),
autoprefixer = require('gulp-autoprefixer'),
rename = require('gulp-rename'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
babel = require('gulp-babel'),
concat = require('gulp-concat'),
about = require('gulp-about'),
print = require('gulp-print'),
gutil = require('gulp-util'),
runSequence = require('run-sequence'),
fs = require('fs'),
mkdirp = require('mkdirp');

runSequence.options.ignoreUndefinedTasks = true;

// Set true if you're in production
const inProduction = true;

// Your JS lib
var libJs = ['gdxg'];

// Your assets folder path
var assetsPath = 'assets';

// Your lib folder's name;
const libName = 'lib';

// Your script file name
const JsFileName = 'app';

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

gulp.task('about', function () {
    return gulp.src('package.json')
        .pipe(about({
            keys: ['name', 'version', 'author', 'description'],
            inject: {
                buildDate: Date.now()
            }
        }))
        .pipe(gulp.dest(''));
});

if (fs.existsSync(jsPath+'/'+JsFileName+'.js')) {
    // Do something
} else {
	fs.writeFile(jsPath+'/'+JsFileName+'.js', "// console.log('test')", function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

if (!inProduction) {
	gulp.task('js', function() {
		return gulp.src(jsPath+'/'+JsFileName+'.js')
			.pipe(sourcemaps.init())
	 		.pipe(babel({
	            presets: ['es2015']
	        }))
			.pipe(uglify().on('error', function(e){
		         console.log(e);
		    }))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest(jsPath))
			.pipe(print(function(filepath) {
		      return "file created : " + filepath;
		    }))
	});
}

else {
	gulp.task('js', function() {
		return gulp.src(jsPath+'/'+JsFileName+'.js')
			.pipe(sourcemaps.init())
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest(jsPath))
			.pipe(print(function(filepath) {
		      return "file created : " + filepath;
		    }))
	});
}

var scripts = [], x;

for (var i = 0; i < libJs.length; i++) {
	x = libJs[i];
	fs.access(libName+'/'+x, fs.constants.R_OK | fs.constants.W_OK, (err) => {
		if (err) {
			console.log(libName+'/'+x);
			console.warn('Directory doesn\'t exist '+err.path);
		} else {
			scripts.push(libName+'/'+x+'/*.js');
			console.log(scripts);
		}

		if (i == libJs.length) {
			scripts.push(jsPath+'/'+JsFileName+'.min.js');
		}
	});
}

gulp.task('concatJS', function() {
  gulp.src(scripts)
    .pipe(concat(JsFileName+'.min.js'))
    .pipe(gulp.dest(jsPath));
});

gulp.task('scripts', function() {
	runSequence('js','concatJS');
});

gulp.task('watch', function() {
	gulp.watch(scssPath+'/*.scss', ['css']);
	gulp.watch(jsPath+'/'+JsFileName+'.js', ['scripts']);
});

gulp.task('default', ['css', 'scripts', 'about']);