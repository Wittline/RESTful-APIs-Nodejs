'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schema = new Schema({        
    timestamp: { type: Number , required:true},    
    issuer_name:{ type: String, uppercase: true, required:true }, 
    total_shares: { type: Number, required:true},      
    share_price: { type: Number, required:true}     
});

module.exports = mongoose.model('orders', Schema);