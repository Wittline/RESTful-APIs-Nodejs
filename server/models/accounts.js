'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schema = new Schema({
  cash: { type: Number,  required: true, default:0 },
  issuers: [{ type: Schema.ObjectId, ref:'orders'}]
});

module.exports = mongoose.model('accounts', Schema);
