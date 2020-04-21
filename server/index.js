'use strict'
var mongoose = require('mongoose');
var app = require('./app');
var config = require('./configuration/config');


var port = process.env.PORT || 3977;

mongoose.Promise= global.Promise;
 
mongoose.connect('mongodb://' + config.mongo.uri + ':27017/' + config.mongo.db, (err, res) => {

 if(err){
    throw err;
 }else{
     console.log("Conexion a base de datos exitosa.");
     app.listen(port, function(){
       console.log("servidor del api rest escuchando en http://localhost:" + port);
     });
 }

});
