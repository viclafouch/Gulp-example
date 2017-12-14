const gulp = require('gulp'),
compass = require('gulp-compass'),
autoprefixer = require('gulp-autoprefixer'),
rename = require('gulp-rename'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
babel = require('gulp-babel'),
livereload = require('gulp-livereload'),
concat = require('gulp-concat'),
about = require('gulp-about'),
print = require('gulp-print'),
inject = require('gulp-inject'),
gutil = require('gulp-util'),
jeditor = require("gulp-json-editor"),
runSequence = require('run-sequence'),
fs = require('fs'),
mkdirp = require('mkdirp');

runSequence.options.ignoreUndefinedTasks = true;

livereload({ start: true })

// Set true if you're in production
const inProduction = false;

// Your JS lib
var libJs = [];

// Your json package
var jsonData = {
	'description': '',
	'version': '',
	'author': '' 
}

// Your assets folder path
var assetsPath = 'assets';

// Your lib folder's name;
const libName = 'lib';

// Your script file name
const jsFileName = 'app';

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
    gutil.log(err);
});

mkdirp('lib', function(err) {});

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
	        return gutil.log(err);
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
    	.pipe(gulp.dest(cssPath))
    	.pipe(livereload());
});

gulp.task('about', function () {
	fs.unlinkSync('about.json');
    return gulp.src('package.json')
        .pipe(about({
            keys: [
	            'name', 
	            'version', 
	            'author', 
	            'description'
            ],
            inject: {
                buildDate: Date.now()
            }
        }))
        .pipe(gulp.dest(''));
});

if (fs.existsSync(jsPath+'/'+jsFileName+'.js')) {
    // Do something
} else {
	fs.writeFile(jsPath+'/'+jsFileName+'.js', "// Script app", function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});
}

if (!inProduction) {
	gulp.task('js', function() {
		return gulp.src(jsPath+'/'+jsFileName+'.js')
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
		return gulp.src(jsPath+'/'+jsFileName+'.js')
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
			gutil.log('Library '+x+' doesn\'t exist '+err.path);
		} else {
			scripts.push(libName+'/'+x+'/*.js');
		}

		if (i == libJs.length) {
			scripts.push(jsPath+'/'+jsFileName+'.min.js');
		}
	});
}

gulp.task('concatJS', function() {
	gulp.src(scripts)
		.pipe(concat(jsFileName+'.min.js'))
		.pipe(gulp.dest(jsPath))
		.pipe(livereload());
});

gulp.task('jsonNew', () => {
	gulp.src("package.json")
  	.pipe(jeditor({
    	'version': jsonData.version,
    	'description': jsonData.description,
    	'author': jsonData.author,
  	}))
  	.pipe(gulp.dest(""));
}); 

gulp.task('index', function () {
	if (fs.existsSync('index.html')) {
	    // Do something
	} else {
		var target = gulp.src('template/index.html');
		var sources = gulp.src([jsPath+'/'+jsFileName+'.min.js', cssPath+'/styles.min.css'], { read: false });
	
		return target
		.pipe(inject(sources, { addRootSlash: false }))
		.pipe(gulp.dest(''));
	}
});

gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(gulp.dest(''))
        .pipe(livereload());
});

gulp.task('general', function() {
	runSequence('css', 'js','concatJS', 'index', 'jsonNew', 'about', 'watch');
});

gulp.task('scripts', function() {
	
	runSequence('js','concatJS');

	return gulp.src(jsPath+'/'+jsFileName+'.min.js').pipe(livereload())

});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch(scssPath+'/*.scss', ['css']);
	gulp.watch(jsPath+'/'+jsFileName+'.js', ['scripts']);
	gulp.watch('index.html', ['html']);
});

gulp.task('default', ['general']);