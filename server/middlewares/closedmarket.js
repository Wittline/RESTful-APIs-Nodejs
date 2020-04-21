'use strict'
var moment = require('moment');
var config = require('../configuration/config');
var OrdersController = require('../controllers/orders');



exports.closedmarket= function(req, res, next){

    var hour_request = 0

    try {

        hour_request = moment.unix(req.body.timestamp).format("HH");
    }
    catch(ex){
        var date = new Date();
        var tms = date.getTime();        
        hour_request = moment.unix(tms).format("HH")
    }          

    if(hour_request >= config.api.closed_market_hour_start && hour_request <= config.api.closed_market_hour_end){

        next();
    }
    else{
        
        if(req.params.id != undefined){

                    OrdersController.getAccountData(req.params.id , function(callbackPostData){
                        if(callbackPostData.value===null){ 
                            return res.status(callbackPostData.httpcode).send({message:callbackPostData.message}); 
                        }
                        else{ 
                            
                            var issuers  = callbackPostData.value.issuers.map(u => { return {
                                issuer_name: u.issuer_name,
                                total_shares: u.total_shares,
                                share_price: u.share_price                    
                            }});

                            var result = {};
                            result.current_balance = {};
                            result.business_error = [];
                            result.business_error.push("Closed Market");
                            
                            result.current_balance.cash = callbackPostData.value.cash
                            result.current_balance.issuers = issuers

                            return res.status(callbackPostData.httpcode).send(result);                             
                        }
                });
        }
        else {
            var result = {};
            result.business_error = [];
            result.business_error.push("Closed Market");
            return res.status(202).send(result); 

        }


    }
};
