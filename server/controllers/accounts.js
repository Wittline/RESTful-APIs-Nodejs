'use strict'

var Accounts = require('../models/accounts');


function AddAccount(req, res){

    var account = new Accounts()
    account.cash = req.body.cash

    account.save((err, accountstored)=>{
        if(err){
                res.status(500).send({message:err });                          
            }else{
                if(!accountstored){
                    res.status(404).send({ message:err });                   
                }
                else {                      
                    res.status(202).send( {"id": accountstored._id, "cash": accountstored.cash, "issuers": accountstored.issuers} );              
                }
            }
        }); 
}


module.exports= {
  AddAccount
};
