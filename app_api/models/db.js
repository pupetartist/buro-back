var mongoose = require( 'mongoose' );
var express = require('express');
app = express();

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   

var dbURI = 'mongodb://localhost/Buro';
    if (process.env.NODE_ENV === 'production') {
        dbURI = process.env.MONGOLAB_URI;
    }

mongoose.connect(dbURI, options);

var conn = mongoose.connection;      

conn.on('error', console.error.bind(console, 'connection error:'));



var readLine = require ("readline");
if (process.platform === "win32"){
    var rl = readLine.createInterface ({
        input: process.stdin,
        output: process.stdout
    });
    rl.on ("SIGINT", function (){
        process.emit ("SIGINT");
    });
}


mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

//CLOSE DATABASE AND LISTENING RESTARTS

gracefulShutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
    callback();
    });
};

// For nodemon restarts
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function () {
        process.exit(0);
    });
});

// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
        process.exit(0);
    });
}); 

require('./profile');
require('./users');