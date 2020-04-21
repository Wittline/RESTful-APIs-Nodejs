'use strict'
var moment = require('moment');
var config = require('../configuration/config');
var OrdersController = require('../controllers/orders');
var Orders = require('../models/orders');



exports.duplicated= function(req, res, next){

    OrdersController.getAccountData(req.params.id, function(callbackPostData){
        if(callbackPostData.value===null){ 
            return res.status(callbackPostData.httpcode).send({message:callbackPostData.message}); 
        }
        else{          
                var ids = []
                callbackPostData.value.issuers.forEach(element => {
                    ids.push(element._id)
                });     
                
                
                var issuers  = callbackPostData.value.issuers.map(u => { return {
                    issuer_name: u.issuer_name,
                    total_shares: u.total_shares,
                    share_price: u.share_price                    
                  }});
                

                Orders.find( { "_id" :  { $in : ids }, "issuer_name" :  req.body.issuer_name })
                .select('-_id timestamp')
                .sort('-timestamp')                 
                .exec(function(err,ordersfound){
                            if(err){
                                return res.status(500).send({message:err});                         
                            }
                            else {
                                if(!ordersfound){ 
                                    next();
                                }
                                else{ 
                                    
                                    var tmscurrent = req.body.timestamp
                                    var tms = ordersfound[0].timestamp

                                    if((tmscurrent-tms) >= config.api.interval ) {

                                        next();
                                    }
                                    else if(tms > tmscurrent){

                                        var result = {};
                                        result.current_balance = {};
                                        result.business_error = [];
                                        result.business_error.push("Invalid Operation");
                                        
                                        result.current_balance.cash = callbackPostData.value.cash
                                        result.current_balance.issuers = issuers
                    
                                        return res.status(callbackPostData.httpcode).send(result); 
                                    }   
                                    else{
                                                                                                                        
                                        var result = {};
                                        result.current_balance = {};
                                        result.business_error = [];
                                        result.business_error.push("Duplicated Operation");
                                        
                                        result.current_balance.cash = callbackPostData.value.cash
                                        result.current_balance.issuers = issuers
                    
                                        return res.status(callbackPostData.httpcode).send(result);   
                                    }                              
                                    
                                }
                            }    
                }); 
            }
        }); 
};
