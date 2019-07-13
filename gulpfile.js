var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    OutputDir;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  OutputDir = 'builds/development/';
} else {
  OutputDir = 'builds/production/';
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
    .pipe(gulp.dest(OutputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', async function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: OutputDir + 'images',
      style: 'expanded'
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
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', async function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('watch', async function() {
  gulp.watch(coffeeSources,gulp.series('coffee'));
  gulp.watch(jsSources,gulp.series('js'));
  gulp.watch('components/sass/*.scss',gulp.series('compass'));
  gulp.watch(htmlSources,gulp.series('html'));
  gulp.watch(jsonSources,gulp.series('json'));
});
//not working for gulp v4 - [xxx tasks] - use gulp.series() or gulp.parallel() 
//no need to specify "gulp default" for 'default' task; just use "gulp" command
gulp.task('default', gulp.series('html','json','coffee', 'js', 'compass','connect','watch'));