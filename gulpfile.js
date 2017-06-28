const gulp = require('gulp');
const babel = require('gulp-babel');
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');

gulp.task('transpile', () => {
    return gulp.src('public/src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default',['transpile']);
gulp.task('test', () => {
    return gulp.src('tests/**/*.spec.js')
        .pipe(jasmine({
            reporter: new reporters.TerminalReporter({showStack: true})
        }));
});
gulp.task('testwatch', () => {
    return gulp.watch(['tests/**/*.spec.js','public/src/**/*.js'], ['test']);
});
