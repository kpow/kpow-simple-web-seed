'use strict';

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
  return gulp.src('app/styles/main.less')
  .pipe($.less())
  .pipe($.autoprefixer('last 2 versions'))
  .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('scripts', function () {
  return gulp.src('app/scripts/*.js')
  .pipe($.jshint())
  .pipe($.jshint.reporter(require('jshint-stylish')))
  .pipe($.size());
});

gulp.task('html', ['styles', 'scripts'], function () {
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src('app/*.html')
  .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
  .pipe(jsFilter)
  .pipe($.uglify())
  .pipe(jsFilter.restore())
  .pipe(cssFilter)
  .pipe($.csso())
  .pipe(cssFilter.restore())
  .pipe($.useref.restore())
  .pipe($.useref())
  .pipe(gulp.dest('dist'))
  .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
  // .pipe($.imagemin({
  //       optimizationLevel: 2,
  //       progressive: true,
  //       interlaced: true
  //   }))
  .pipe(gulp.dest('dist/images'))
  .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/*')
  .pipe($.flatten())
  .pipe(gulp.dest('dist/fonts'))
  .pipe($.size());
});

gulp.task('video', function () {
  return gulp.src('app/video/*')
  .pipe(gulp.dest('dist/video'))
  .pipe($.size());
});

gulp.task('audio', function () {
  return gulp.src('app/audio/*')
  .pipe(gulp.dest('dist/audio'))
  .pipe($.size());
});

gulp.task('extras', function () {
  return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', /*'audio','video',*/'extras']);

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('connect', function () {
  var connect = require('connect');
  var app = connect()
  .use(require('connect-livereload')({ port: 35729 }))
  .use(connect.static('app'))
  .use(connect.static('.tmp'))
  .use(connect.directory('app'));

  require('http').createServer(app)
  .listen(6600)
  .on('listening', function () {
    console.log('Started connect web server on http://localhost:6600');
  });
});

gulp.task('serve', ['connect', 'styles'], function () {
  require('opn')('http://localhost:6600');
});

gulp.task('watch', ['connect', 'serve'], function () {
  var server = $.livereload();

  // watch for changes

  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'app/images/**/*'
    ]).on('change', function (file) {
      server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.less', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
  });

  gulp.task('stage', function () {
    return gulp.src('dist/**')
    .pipe($.sftp({
      host: '184.106.225.249',
      user: 'studiosquared',
      pass: '!S2Adm1n',
      remotePath : 'public_html/dse-landing'
    }));
  });

  gulp.task('prod', function () {
    return gulp.src('dist/**')
    .pipe($.sftp({
      host: '184.106.225.249',
      user: 'studiosquared',
      pass: '!S2Adm1n',
      remotePath : 'domains/dse.studiosquared.net/public_html/'
    }));
  });
