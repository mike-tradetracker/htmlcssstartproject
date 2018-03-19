const gulp = require('gulp');
const gsass = require('gulp-sass');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const browserify = require('gulp-browserify');
const cssmin = require('gulp-cssmin');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    htmlSource: 'src/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/img/**',
}

const DESTINATIONPATH = {
    appRoot: 'app/',
    css: 'app/css',
    img: 'app/img',
    js: 'app/js',
    fonts: 'app/fonts'
}

gulp.task('cleanHTML', () => {
    gulp.src(DESTINATIONPATH.appRoot + '/*.html', { read: false, force: true })
        .pipe(clean())
});

gulp.task('cleanJS', () => {
    gulp.src(DESTINATIONPATH.js + '/*.js', { read: false, force: true })
        .pipe(clean())
});

gulp.task('copyHTML', ['cleanHTML'], () => {
    gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(DESTINATIONPATH.appRoot));
});

gulp.task('copyJS', ['cleanJS'], () => {
    return gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(gulp.dest(DESTINATIONPATH.js));
});

/* PRODUCTION TASKS */

gulp.task('compressJS', () => {
    return gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(minify())
        .pipe(gulp.dest(DESTINATIONPATH.js));
});

gulp.task('compressCSS', () => {
    const bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    const fontAwesome = gulp.src('./node_modules/font-awesome/css/font-awesome.css');
    const sassFiles = gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(gsass({ outputStyle: 'expanded' })).on('error', gsass.logError);

    return merge(bootstrapCSS, fontAwesome, sassFiles)
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(DESTINATIONPATH.css));
});

gulp.task('compressHTML', () => {
   return gulp.src(SOURCEPATHS.htmlSource)
              .pipe(htmlmin({collapseWhitespace: true}))
              .pipe(gulp.dest(DESTINATIONPATH.appRoot)) 
});

/* EOF PRODUCTION TASKS */

gulp.task('images', () => {
    return gulp.src(SOURCEPATHS.imgSource)
        .pipe(newer(DESTINATIONPATH.img))
        .pipe(imagemin())
        .pipe(gulp.dest(DESTINATIONPATH.img));
});

gulp.task('moveBootstrapFonts', () => {
    gulp.src()
});

gulp.task('sass', () => {
    const bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    const fontAwesome = gulp.src('./node_modules/font-awesome/css/font-awesome.css');
    const sassFiles = gulp.src(SOURCEPATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(gsass({ outputStyle: 'expanded' })).on('error', gsass.logError);

    return merge(bootstrapCSS, fontAwesome, sassFiles)
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(DESTINATIONPATH.css));
});

gulp.task('fonts', () => {
    return gulp.src('./node_modules/font-awesome/fonts/*.{eot,svg,ttf,woff,woff2,otf}')
        .pipe(gulp.dest(DESTINATIONPATH.fonts));
})

gulp.task('serve', ['sass'], () => {
    browserSync.init([
        DESTINATIONPATH.css + '/*.css',
        DESTINATIONPATH.appRoot + '/*.html',
        DESTINATIONPATH.js + '/*.js'], {
            server: {
                baseDir: DESTINATIONPATH.appRoot
            }
        })
});

gulp.task('watch', ['serve', 'sass', 'fonts', 'copyHTML', 'cleanHTML', 'copyJS', 'cleanJS', 'images'], () => {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copyHTML']);
    gulp.watch([SOURCEPATHS.jsSource], ['copyJS']);
});

gulp.task('default', ['watch']);
gulp.task('build', ['compressHTML', 'compressJS', 'compressCSS', 'images']);