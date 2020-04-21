'use strict'

var express = require('express');
var AccountsController = require('../controllers/accounts');
var OrdersController = require('../controllers/orders');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_closeMarket = require('../middlewares/closedmarket');
var md_duplicated = require('../middlewares/duplicated');


api.post('/accounts', md_auth.ensureAuth, md_closeMarket.closedmarket, AccountsController.AddAccount);
api.post('/accounts/:id/orders', md_auth.ensureAuth, md_closeMarket.closedmarket, md_duplicated.duplicated, OrdersController.AddOrders);


module.exports = api;
