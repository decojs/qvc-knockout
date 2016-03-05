var gulp = require('gulp');
var karma = require('karma');

gulp.task('test', function(done){
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  }, done).start();
});

gulp.task('watch', function(done){
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
    browsers: ['PhantomJS']
  }, done).start();
});