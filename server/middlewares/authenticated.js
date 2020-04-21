'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret= 'brokerage2020tokendecode';
var config = require('../configuration/config');


exports.ensureAuth= function(req, res, next){

  if (config.jwt.isauthenticated){

        if(!req.headers.authorization){
          return res.status(403).send({message:'la peticion no tiene cabecera'});
    }

    var token = req.headers.authorization.replace(/['""]+/g, '');

    try {
    var payload = jwt.decode(token, secret);

      if(payload.exp <= moment().unix()){
        return res.status(401).send({message:'token ha expirado'});
      }    
    } catch (ex) {

      return res.status(404).send({message:'token no valido'});
    }

      req.user= payload;
  }


    
    next();
};
