# [Gulp-example]

Example of a gulpfile which build your own project (good for beginners).

## Informations

<table>
<td>Description</td>
<td>A complete gulpfile for your project</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
<tr>
<td>Ruby Version</td>
<td>>= 2.0</td>
</tr>
<tr>
<td>Compass</td>
<td>>= 1.0.1</td>
</tr>
</table>

## Description

This example of Gulpfile will allow you to create your own autonomous project to facilitate several tasks: concatenation of files, compression and minification, auto-refresh and auto-prefix for your css.

A simple configuration file : **gulpfile.js**

![demo](https://im3.ezgif.com/tmp/ezgif-3-4cfbdb0f0c.gif)

Here is the list of the gulp plugins used : 

* [babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)
* [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
* [browserslist](https://github.com/ai/browserslist)
* [gulp-about](https://github.com/michaelbazos/gulp-about)
* [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)
* [gulp-babel](https://github.com/babel/gulp-babel)
* [gulp-clean-css](https://github.com/scniro/gulp-clean-css)
* [gulp-concat](https://github.com/contra/gulp-concat)
* [gulp-if](https://github.com/robrich/gulp-if)
* [gulp-inject](https://github.com/klei/gulp-inject)
* [gulp-json-editor](https://github.com/morou/gulp-json-editor)
* [gulp-livereload](https://github.com/vohof/gulp-livereload)
* [gulp-print](https://github.com/alexgorbatchev/gulp-print)
* [gulp-rename](https://github.com/hparra/gulp-rename)
* [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps)
* [gulp-uglify](https://github.com/terinjokes/gulp-uglify)
* [gulp-webserver](https://github.com/schickling/gulp-webserver)
* [gulp-util](https://github.com/gulpjs/gulp-util)
* [run-sequence](https://www.npmjs.com/package/run-sequence)

## Usage

4 requirements are necessary to use Gulp-example : **Gulp**, **NodeJS**, **Ruby** and **Compass** are required.

* Gulp : https://gulpjs.com/
* NodeJs : https://nodejs.org/en/download/
* Ruby : https://www.ruby-lang.org/en/downloads/
* Compass :  http://compass-style.org/install/

If you want to have an autorefresh on your browser, you need livereload
* http://livereload.com/extensions/ and choose your browser.

After cloning the project, run these commands bellow :  

```
npm install
```

```
gulp
```

## Configuration

### inDev

- Type: `Boolean`
- Default: `true`

Define your environment.


### libName

- Type: `String`
- Default: `lib`

Define your library folder name.

### libJS

- Type: `Array`
- Default: `[]`

Include all your js library.

**Note:** Be careful, It has to be the name of the folder which contains the differents js files.
<br/>
**Example of a path** :  `lib/MyLib/script.js` **=>** `['MyLib']`

### assetsPath

- Type: `String`
- Default: `assets`

Define your assets folder name.

### jsFileName

- Type: `String`
- Default: `app`

Define the name of the script file. All of the libraries that you included will be there (with your script).

### jsFolder

- Type: `String`
- Default: `js`

Define your js folder name.

### cssFolder

- Type: `String`
- Default: `css`

Define your css folder name.

### scssFolder

- Type: `String`
- Default: `scss`

Define your scss folder name.

### imgFolder

- Type: `String`
- Default: `img`

Define your img folder name.

### jsonData

- Type: `Object`
- Options:
  - `'description'`: `` => `String`
  - `'version'`: `` => `String`
  - `'author'`: `` => `String`

Define some information about your project.

### autoRefresh

- Type: `Boolean`
- Default: `true`

You can listen for changes and allow auto-refresh based on [livereload for browser](http://livereload.com/extensions/).

## Contribute

Any contributions and/or pull requests would be welcome.

Bug fixes are greatly appreciated.

## License

Gulp-example is licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) license:

Copyright (C) 2017 Victor de la Fouchardiere

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author
[Victor de la Fouchardière](http://www.victor-de-la-fouchardiere.fr/)
