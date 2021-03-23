var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var cotacaoRouter = require('./routes/cotacao');
var papelRouter = require('./routes/papel');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use((req, res, next) => {
//     corsHeaders(res, 3000)
//     next()
// })


// function corsHeaders(res, port) {
//     res.set('Access-Control-Allow-Credentials', 'true');
//     res.set('Access-Control-Allow-Origin', `http://localhost:${port}`);
//     res.set('Access-Control-Allow-Origin', `http://192.168.100.93:${port}`);
//     res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
// }

app.use('/', indexRouter);
app.use('/cotacao', cotacaoRouter);
app.use('/papel', papelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;