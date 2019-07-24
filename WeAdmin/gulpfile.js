var gulp = require('gulp');

// var util = require('util');

// var Undertaker = require('undertaker');

// var registry = new UndertakerRegistry();

// gulp.registry(registry);

// gulp.task('default', function (e) {
//     console.log('默认任务 ', e);
// });

function defaultTask(cb) {
    // place code for your default task here
    cb();
  }
  
  exports.default = defaultTask