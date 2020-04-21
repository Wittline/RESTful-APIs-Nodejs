'use strict'

var moment = require('moment');
var config = require('../configuration/config');
var Orders = require('../models/orders');
var Accounts = require('../models/accounts');



function AddOrders(req, res){

    var orders = new Orders();
    var id_account = req.params.id    
    orders.timestamp = req.body.timestamp
    orders.issuer_name = req.body.issuer_name
    orders.total_shares = Number(req.body.total_shares)
    orders.share_price = Number(req.body.share_price)



    getAccount(id_account, function(callbackPost){
        if(callbackPost.value===null){ 
            return res.status(callbackPost.httpcode).send({message:callbackPost.message}); 
        }
        else{            
            validateOperation(callbackPost.value, orders, req.body.operation, function(callbackoperation){
                if(callbackoperation.value===null){ 
                    return res.status(callbackoperation.httpcode).send({message:callbackoperation.message}); 
                }
                else{
                    getAccountData(id_account, function(callbackPostData){
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

                            if (callbackoperation.value===false){                                
                                result.business_error.push(callbackoperation.message);
                            }
                            
                            result.current_balance.cash = callbackPostData.value.cash
                            result.current_balance.issuers = issuers

                            return res.status(callbackPostData.httpcode).send(result);                             
                        }
                    });
                }
            });                       
        }
    });           
}

function getAccountData(id_account, callback){

    Accounts.find({ _id: id_account })
    .select('_id cash issuers')
    .populate({path:'issuers', select:'_id issuer_name total_shares share_price'})       
    .exec(function(err,exps){
                if(err){                        
                    callback({value:null, httpcode:500, message:err});                
                }
                else {
                    if(!exps){
                        callback({value:null, httpcode:404, message:err });    
                    }
                    else{ 
                        callback({value:exps[0], httpcode:202});                               
                    }
                }    
    });         
}    


function validateOperation(account, orders, operation, callback){

    if(operation==="BUY")  {

        var totalvalue = orders.total_shares * orders.share_price
        if(totalvalue <= account.cash){
            account.cash = account.cash - totalvalue  
  
            orders.save((err, orderstored)=>{
                if(err){

                        callback({value:null, httpcode:500, message:err});                       
                    }
                    else{

                        if(!orderstored){
                            callback({value:null, httpcode:404, message:err});   
                        }
                        else {    
                            
                            account.issuers.push(orderstored._id)
                            account.save(function (err, accUpdated){
                                if(err){

                                    callback({value:null, httpcode:500, message:err });    
                                }
                                else {
                                   
                                  if(!accUpdated){
                                    callback({value:null, httpcode:404, message:err }); 
                                  }
                                  else  {
                                    callback({value:accUpdated, httpcode:202 }); 
                                  }
                                }    
                            });                        
                     }
                 }
            });
        }
        else{
            callback({value:false,  message:'Insufficient Balance'}); 
        }
    }
    else if(operation==="SELL"){

                
        Orders.find( { "_id" :  { $in : account.issuers }, "total_shares" : { $gt : 0}, "issuer_name" : orders.issuer_name })
        .select('_id total_shares share_price')                
        .exec(function(err,ordersfound){
                    if(err){
                        callback({value:null, httpcode:500, message:err });                         
                    }
                    else {
                        if(!ordersfound){ callback({value:null, httpcode:400, message:err });}
                        else{ 

                            var ts = 0
                            var is_stocks = false
                            var kk = 0
                            for(var k in ordersfound) {

                                ts += ordersfound[k].total_shares
                                if(ts >= orders.total_shares ){
                                    ordersfound[k].total_shares = ts-orders.total_shares
                                    is_stocks= true 
                                    kk= k                                    
                                }
                                else{
                                    ordersfound[k].total_shares = 0                                    
                                }                                
                             }

                            if(is_stocks){

                              var pluscash = (orders.total_shares * orders.share_price) 
                                                                       
                                updateAllOrders(ordersfound, function(callbackorderupdate){
                                    if(callbackorderupdate.value===null){ 

                                        callback({value:null, httpcode:callbackorderupdate.httpcode, message:callbackorderupdate.message})                                        
                                    
                                    }
                                    else {

                                        account.cash = pluscash +  account.cash 
                                        account.save(function (err, accUpdated){
                                            if(err){
                                                callback({value:null, httpcode:500, message:err });    
                                            }
                                            else {

                                                if(!accUpdated){
                                                    callback({value:null, httpcode:404, message:err }); 
                                                }
                                                else  {
                                                    callback({value:accUpdated, httpcode:202 }); 
                                                }
                                            }    
                                        }); 
                                    }
                                });
                            }
                            else{
                                callback({value:false,  message:'Insufficient Stocks'}); 
                            }                                                        
                        }
                    }    
        });   
        
    }
    else {
        callback({value:false, message:'Invalid Operation'}); 
    }    
}

function updateAllOrders(ordersfound, callback){
    try{
        ordersfound.forEach(element => {
            element.save(); 
        });
        
        callback({value:false});
    }
    catch(e){
        callback({value:null, httpcode:404, message:e.message});
    }
 
}

function getAccount(id_account, callback){

    Accounts.findById(id_account, (err, acc)=>{
        if(err){    
            
            callback({value:null, httpcode:500, message:err});   
        }
        else {
            if(!acc){
                callback({value:null, httpcode:404, message:err });  
            }
            else { 

                callback({value:acc}); 
            }
        }
    });                      
}  


module.exports= {
  AddOrders,
  getAccountData
};
