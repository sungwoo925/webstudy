const mongoose = require('mongoose');
//yL3ggsefzZccSlPl  user = tjddn
const dbURI = 'mongodb+srv://tjddn:yL3ggsefzZccSlPl@cluster0.cghlnvq.mongodb.net/Loc8r'
const dbPort = 28571;
// const dbURI = `mongodb://127.0.0.1:${dbPort}/Loc8r`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected',function () {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);   
});
mongoose.connection.on('disconnected',function () {
    console.log('Mongoose disconnected');
})

var gracefulShutdown = function (msg, callback){
    mongoose.connection.close(function (){
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

mongoose.connection.on('SIGUSR2',function () {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
mongoose.connection.on('SIGINT',function () {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
mongoose.connection.on('SIGTERM',function () {
    gracefulShutdown('Heroku app shutdown', function() {
        process.exit(0);
    });
});

require('./locations');
require('./users')