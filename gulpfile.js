const gulp = require('gulp');
const terser = require('gulp-terser');
const cleancss = require('gulp-clean-css');
const jsonminify = require('gulp-jsonminify');
const fs = require('fs');
const path = require('path');


// The src() and dest() methods are exposed by gulp to interact with files on your computer.
function jsMinifyTask(cb) {
    return gulp.src(['js/main.js', 'js/editions.js', 'js/logger.js']) // (['./js/client.js', './js/animation.js']) // ignore pattern  '!js/*.min.js'
        .pipe(terser())
        .pipe(gulp.dest('./build/js'));
}

function cssMinifyTask(cb) {
    return gulp.src(['css/styles.css'])
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build/css'));
}

function copyBootstrapCssTask(cb) {
    return gulp.src(['css/bootstrap/*.css', 'css/bootstrap/*.css.map'])
        .pipe(gulp.dest('./build/css/bootstrap'));
}

function copyTypeaheadLibsTask(cb) {
    return gulp.src(['js/typeahead/typeahead.bundle.min.js'])
        .pipe(gulp.dest('./build/js/typeahead'));
}

function copySupportsLibsTask(cb) {
    return gulp.src(['js/jquery-3.5.1.min.js'])
        .pipe(gulp.dest('./build/js'));
}

function addProductionFlagTask(cb) {
    // After all JS files are minified, prepend PRODUCTION_BUILD flag to logger.js
    const loggerPath = path.join(__dirname, 'build/js/logger.js');
    if (fs.existsSync(loggerPath)) {
        const content = fs.readFileSync(loggerPath, 'utf8');
        const productionContent = 'const PRODUCTION_BUILD=!0;' + content;
        fs.writeFileSync(loggerPath, productionContent);
    }
    cb();
}

function copyBootstrapJsTask(cb) {
    return gulp.src(['js/bootstrap/*.js', 'js/bootstrap/*.js.map'])
        .pipe(gulp.dest('./build/js/bootstrap'));
}

function copyHtmlTask(cb) {
    return gulp.src('index.html')
        .pipe(gulp.dest('./build'));
}

function copyAssetsTask(cb) {
    return gulp.src('assets/*.*')
        .pipe(gulp.dest('./build/assets'));
}


function jsonMinifyTask(cb) {
    return gulp.src('cards/*.json')
        .pipe(jsonminify())
        .pipe(gulp.dest('./build/cards'));
}

function emptyTask(cb) {
    // place code for your default task here
    cb(); // use the callback function if you are not returning data
}

//exports.default = gulp.series(emptyTask, minifyTask);
exports.default = gulp.series(
    gulp.parallel(emptyTask, jsMinifyTask, cssMinifyTask, jsonMinifyTask,
        copyHtmlTask, copyAssetsTask, copySupportsLibsTask, copyTypeaheadLibsTask,
        copyBootstrapCssTask, copyBootstrapJsTask),
    addProductionFlagTask
);
