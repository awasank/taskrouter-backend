// const app = require('./app');
require('dotenv').config();
const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const twilio = require('twilio');
var cors = require('cors')
const mongoose = require("mongoose");
const twilio = require("twilio")
const userRoutes = require('./router');

const app = express();

const { port, mongo_string } = require('./config');
const connectdb = require('./models/connectdb');

mongoose.Promise = global.Promise;
mongoose.set('useUnifiedTopology', false);
mongoose.connect(mongo_string, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
connectdb()
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

// Routes - ./src/router
app.use('/ivr', twilio.webhook({validate: false}), userRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});
/*******************/
// console.log(`Server started on port ${port}`);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // Connect to the database
// connectdb()

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: (app.get('env') === 'development') ? err : {},
//   });
// });




// const server = app.listen(config.port, function() {
//   console.log('Express server listening on port ' + server.address().port);
// });

// module.exports = server;
