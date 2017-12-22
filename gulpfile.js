/*

	=======* Gulp Example *=======

	Welcome to configuration of Gulp example

	Follow the instructions. Don't forget to use *npm install*. 

	NodeJS, Ruby and Compass are required.

	Please be sure to have these 4 requirements

		- Install Gulp : 
		- Install NodeJs : https://nodejs.org/en/download/
		- Install Ruby : https://www.ruby-lang.org/en/downloads/
		- Install Compass : http://compass-style.org/install/

		If you want to have an autorefresh on your browser, you need livereload
		==> http://livereload.com/extensions/ and choose your browser

	Description:

	In your command prompt, run : gulp

	URL doc: https://github.com/viclafouch/Gulpfile

*/

/*==============================================
=            Gulpfile Configuration            =
==============================================*/

/* Assets */

/* The Environment 
@Options : {
	true,
	false
}

*/
const inDev = false;

/* Your javascript lib folder's name
@Options : {
	String
}
*/
const libName = 'lib';

/* Your Javascript library's name
@Options : {
	array of strings
}

!Be careful, library name is the name of the folder which contains differents files
@Example of the path : lib/MyLib/script.js => ['MyLib']
*/
const libJs = [];

/* Your assets folder path
@Options : {
	String
}
*/
const assetsPath = 'assets';

/* Your script file name
@Options : {
	String
}
*/
const jsFileName = 'app';

/* Your assets folder's name
@Options : {
	String
}
*/
const jsFolder = 'js';
const cssFolder = 'css';
const scssFolder = 'scss';
const imgFolder = 'img';

/* About */

/* Informations about the package.json
@Options : {
	{description: String, version: String, author: String}
}
*/
var jsonData = {
	'description': '',
	'version': '',
	'author': '' 
}

/* Some stuff */

/* Use livereload ? (Browser extension is required)
@Options : {
	true,
	false
}

*/
const autoRefresh = true;


/*=====  End of Configuration  ======*/

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
gulpif = require('gulp-if'),
about = require('gulp-about'),
print = require('gulp-print'),
inject = require('gulp-inject'),
gutil = require('gulp-util'),
jeditor = require("gulp-json-editor"),
runSequence = require('run-sequence'),
fs = require('fs'),
mkdirp = require('mkdirp');

runSequence.options.ignoreUndefinedTasks = true;

livereload({ start: autoRefresh })

// Instance path folder
const jsPath = assetsPath+'/'+jsFolder;
const cssPath = assetsPath+'/'+cssFolder;
const scssPath = assetsPath+'/'+scssFolder;
const imgPath = assetsPath+'/'+imgFolder;

const paths = [jsPath, cssPath, scssPath, imgPath];

// Creat assets' folder
mkdirp(assetsPath, function(err) {
	if (err) {
 		logError('An error occurred during creation of folder !', err);
	}
});

mkdirp('lib', function(err) {});


// Creat subFolders to assets folder
for (var i = paths.length - 1; i >= 0; i--) {
	var t = paths[i];
	if (!fs.existsSync(t)) {
		mkdirp(t, function(err, t) {
			if (err) {
		 		logError('An error occurred during creation of folder !', err);
			} else {
				logSuccess('folder created :'+t);
			}
		});
	}
}


var logSuccess = (text) => {
	gutil.log('--------------------');
	gutil.log(gutil.colors.green(text));
	gutil.log('--------------------');
}

var logError = (text, err) => {
	gutil.log(gutil.colors.red(text));
	gutil.log(gutil.colors.red('----------Error below----------'));
	gutil.log(gutil.colors.red(err));
}

if (fs.existsSync(scssPath+'/styles.scss')) {
    // Do something
} else {
	fs.writeFile(scssPath+'/styles.scss', "", function(err) {
	    if (err) {
	 		logError('An error occurred during creation of scss file !', err);
		}
	});
}

/*=====  Gulp  ======*/

gulp.task('css', function() {
	return gulp.src([scssPath+'/*.scss'])
		.pipe(compass({
		 	css: cssPath,
			sass: scssPath,
			logging: false,
			import_path: false,
			time: true,
			comments: false,
			style: 'compressed'
		}))
		.on('error', function(err) {
	 		logError('An error occurred during compress to css file !', err.message+ ' : error in your file !');
	      	this.emit('end');
	    })
	    .pipe(print(function(filepath) {
	    	logSuccess('file created : '+filepath);
	    }))
		.pipe(autoprefixer(
			'last 2 version', 
			'safari 5', 
			'ie 7', 
			'ie 8', 
			'ie 9', 
			'opera 12.1', 
			'ios 6', 
			'android 4')
		)
    	.pipe(gulp.dest(cssPath))
    	.pipe(rename({ suffix: '.min' }))
    	.pipe(cleanCSS({compatibility: 'ie8'}))
    	.pipe(gulp.dest(cssPath))
    	.pipe(gulpif(autoRefresh, livereload()));
});

gulp.task('about', function () {
	if (fs.existsSync('about.json')) {
		fs.unlinkSync('about.json');
	}

	var t = new Date();
	t = t.toString();

    return gulp.src('package.json')
        .pipe(about({
            keys: [
	            'name', 
	            'version', 
	            'author', 
	            'description'
            ],
            inject: {
                lastUpdate: t
            }
        }))
        .pipe(gulp.dest(''));
});

if (fs.existsSync(jsPath+'/'+jsFileName+'.js')) {
    // Do something
} else {
	fs.writeFile(jsPath+'/'+jsFileName+'.js', "// Script app", function(err) {
	    if(err) {
	 		logError('An error occurred during creation of js file !', err);
	    }
	});
}

if (!inDev) {
	gulp.task('js', function() {
		return gulp.src(jsPath+'/'+jsFileName+'.js')
			.pipe(sourcemaps.init())
	 		.pipe(babel({
	            presets: ['es2015']
	        }))
	        .on('error', (err) => {
	        	logError('An error occurred during compressed js', err.message);
	        	this.emit('end');
		    })
			.pipe(uglify()
			.on('error', function(err){
	 			logError('An error occurred during compressed js', err);
	 			this.emit('end');
		    }))
			.pipe(rename({ suffix: '.min' }))
			.pipe(gulp.dest(jsPath))
			.pipe(print(function(filepath) {
				logSuccess('file created : '+filepath);
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
		      logSuccess('file created : '+filepath);
		    }))
	});
}

var scripts = [], x;

for (var i = 0; i < libJs.length; i++) {
	x = libJs[i];
	fs.access(libName+'/'+x, fs.constants.R_OK | fs.constants.W_OK, (err) => {
		if (err) {
			logError('Library '+x+' doesn\'t exist '+err.path, err)
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
		.pipe(gulpif(autoRefresh, livereload()));
});

gulp.task('jsonNew', () => {
	gulp.src("package.json")
  	.pipe(jeditor({
    	'version': jsonData.version,
    	'description': jsonData.description,
    	'author': jsonData.author,
  	}))
  	.pipe(gulp.dest(''));
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
        .pipe(gulpif(autoRefresh, livereload()));
});

gulp.task('general', function() {
	runSequence(
		'css', 
		'js',
		'concatJS', 
		'index', 
		'jsonNew', 
		'about', 
		'watch'
	);
});

gulp.task('scripts', function() {
	
	runSequence(
		'js',
		'concatJS'
	);

	return gulp.src(jsPath+'/'+jsFileName+'.min.js').pipe(livereload())

});

gulp.task('watch', function() {
	if (autoRefresh) {
		livereload.listen()
	}
	gulp.watch(scssPath+'/*.scss', ['css']);
	gulp.watch(jsPath+'/'+jsFileName+'.js', ['scripts']);
	gulp.watch('index.html', ['html']);
});

gulp.task('default', ['general']);