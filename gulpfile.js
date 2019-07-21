var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify-es').default,
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    OutputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  OutputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  OutputDir = 'builds/production/';
  sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [OutputDir + '*.html'];
jsonSources = [OutputDir + 'js/*.json'];

gulp.task('coffee', async function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', async function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify())
      .on('error', gutil.log))
    .pipe(gulp.dest(OutputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', async function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: OutputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(OutputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('connect', async function() {
  connect.server({
    root: OutputDir,
    livereload: true
  });
});

gulp.task('html', async function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(OutputDir)))
    .pipe(connect.reload())
});

gulp.task('json', async function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js/')))
    .pipe(connect.reload())
});

gulp.task('watch', async function() {
  gulp.watch(coffeeSources,gulp.series('coffee'));
  gulp.watch(jsSources,gulp.series('js'));
  gulp.watch('components/sass/*.scss',gulp.series('compass'));
  gulp.watch('builds/development/*.html',gulp.series('html'));
  gulp.watch('builds/development/js/*.json',gulp.series('json'));
});
//not working for gulp v4 - [xxx tasks] - use gulp.series() or gulp.parallel() 
//no need to specify "gulp default" for 'default' task; just use "gulp" command
gulp.task('default', gulp.series('html','json','coffee', 'js', 'compass','connect','watch'));