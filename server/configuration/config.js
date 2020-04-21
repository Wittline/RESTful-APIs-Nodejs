
var config = module.exports = {};

 
//mongo database
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'localhost';
config.mongo.db = 'brokerage';


//middlewares 
config.jwt = {};
config.jwt.isauthenticated = false

//mongo database
config.api = {};
config.api.closed_market_hour_start = 6
config.api.closed_market_hour_end = 15
config.api.interval = 300 //5 minutes
