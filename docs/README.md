# RESTful APIs with Node, Mongodb and Express
Building RESTful API REST services with Node.js, Express.js and Mongoose.js

## Scenario
A brokerage firm needs to have an API service to process a set of buy/sell orders. This API must have two endpoints, the first one to create an account with the initial balance, and the second one to send the buy/sell orders. For each order, the API expect to receive a timestamp (for when it took place), an operation type (buy or sell), issuer name (stock’s identifier), a total amount of shares (a positive integer number), and the unitary price of the share (a positive real number).

Please make sure that all the following business rules are validated:

1. Insufficient Balance: When buying stocks, you must have enough cash in order to fulfill it.
2. Insufficient Stocks: When selling stocks, you must have enough stocks in order to fulfill it.
3. Duplicated Operation: No operations for the same stock at the same amount must happen within a 5 minutes interval, as
they are considered duplicates.
4. Closed Market: All operations must happen between 6am and 3pm.
5. Invalid Operation: Any other invalidity must be prevented.

A business rule violation is not consired an error, since in the real world they may happen. In case any happens, you must list
them in the output as an array, and have no changes applied for that order, following to process the next order.

## Required API endpoints.
### Create investment account
The first endpoint will be used to create an investment account. The expected contract is:

### Request:
```POST /accounts```
### Body:
```
 
  {
   "cash": 1000
  }
```

### Expected response:
```
  {
    "id": 1,
    "cash": 1000,
    "issuers": []
  }
```
### Send a buy/sell order
The second endpoint will be used to send orders into a specific account.
### Request:
```POST /accounts/:id/orders```
### Body:
```
{
"timestamp": 1571325625,
"operation": "BUY",
"issuer_name": "AAPL",
"total_shares": 2,
"share_price": 50
}
```
### Expected response:
``` 
{
      "current_balance": {
      "cash": 900,
      "issuers": [
          {
          "issuer_name": "AAPL",
          "total_shares": 2,
          "share_price": 50
          }
      ]
    },
    "business_errors": []
}
```
Multiple issuers are accepted, so given this other payload:
``` 
 {
  "timestamp": 1583362645,
  "operation": "BUY",
  "issuer_name": "NFTX",
  "total_shares": 10,
  "share_price": 80
  }
 ```
### Expected respose:
``` 
{
  "current_balance": {
    "cash": 0,
    "issuers": [
        {
          "issuer_name": "AAPL",
          "total_shares": 2,
          "share_price": 50
        },
        {
          "issuer_name": "NFTX",
          "total_shares": 10,
          "share_price": 80
        }
    ]
  },
  "business_errors": []
}
```
If a business error occurs, the expected response should be:
``` 
{
"current_balance": {
  "cash": 1000,
  "issuers": []
  },
  "business_errors": ["CLOSE_MARKET"]
}
```
## Translating  business rules and requirements into code
* <strong> Insufficient Balance, When buying stocks, you must have enough cash in order to fulfill it:</strong> Before an operation of the type "BUY" the current balance will be checked, the number of shares to be purchased multiplied by the price of each share must be less than or equal to the current balance.

* <strong> Insufficient Stocks, When selling stocks, you must have enough stocks in order to fulfill it:</strong> Before an operation of the type "SELL", it will be verified if the number of shares previously purchased are enough for the number of shares to be sold in the request.

* <strong> Duplicated Operation, No operations for the same stock at the same amount must happen within a 5 minutes interval, as
they are considered duplicates:</strong> Operations for the same issuer and nearby timestamps will be avoided, the date of the last order of the issuer that is sent in the request will be taken and a subtraction will be made between the two timestamps. The interval can be modified from the configuration file. the code will be separated in a middleware.

* <strong> Closed Market, All operations must happen between 6am and 3pm. </strong> This code will be separated in a middleware, the timestamp hour will be extracted from the request, and it will be used to verified that the request is at the correct intervals to consume the API. The ranges can be modified from the configuration file.

* <strong> A business rule violation is not consired an error, since in the real world they may happen. In case any happens, you must list them in the output as an array, and have no changes applied for that order, following to process the next order:</strong> There is no information if the payload will have an array of orders that will be sent in the same request, it only specify about multiple payloads but in different requests, therefore, it is difficult to have, show and map the  "business errors" for each order, since it does not it will be known to which order the content of the array  is pointed. then the content of the array "business error" will have the last attempt in a request.

## Choosed technologies and tools
* <strong>Nodejs:</strong> It is the technology used to host the API REST as a server application, it allows me to create non-blocking code which can scale quickly.
* <strong>MongoDB:</strong> It is a database based on documents, and through the mongoosejs framework it will allow me to create queries to it using javascript.
* <strong>express.js:</strong> It will allow me to create an API REST quickly and easy
* <strong>Visual studio code</strong>
* <strong>Postman:</strong> It will allow me to send test request to the API REST and check the responses
* <strong>MongoDB Compass:</strong> It will allow me to check, and manage the collections and documents in the the mongodb databases
* <strong>Mocha.js chai.js and chai-http.js:</strong> will allow me to create <strong>unittests</strong> 
* <strong>nyc.js:</strong> It will allow me to have a measure of the <strong>coverage</strong> of the unittests

## How to use the code
* Install Mongodb
* Install the lastes version of node from: <a href="https://nodejs.org/en/"><strong> Install node </strong></a>
* Install NodeJs.msi
* Open Node.js command prompt and see the installed version
* Install npm with the command:
```
 npm install npm -g
```
* Download the "server" folder from this repository
* go to CMD and write the location of this folder on your computer

![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/1.PNG)

* now write the command :
```
 npm start
```
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/2.PNG)

## Testing the API with Postman
<strong> Creating a new account </strong>
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/3.PNG)

<strong> Buy shares </strong>
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/4.PNG)
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/5.PNG)

<strong> Sell shares </strong>
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/6.PNG)

<strong> Insufficient Stocks </strong>
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/7.PNG)

## Checking collections and documents in MongoDB Compass
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/9.PNG)



## Conclusions
<strong> Extensible </strong>
The application code was designed to be extensible, if you want to add new APIs, just add the file of the new api inside the "routes" folder and there is no need to modify the existing code, then add the new controllers in the "controllers" , if we want add a new data model only use  the "models"  folder with the new mongoose schema,  this code architecture allows me to reuse existing code from a controller or a model, it also allows me to add filters to the original request and validate the payload using middlewares.

<strong> Scalable </strong>
The existing code is non-blocking code, because of this, it can be easily scaled, if there is  an APIs that are more in demand than others, it could be separated in another server or container, this allows copying the code quickly because each api is related to a set of separate modules allowing high granularity. The application has a middleware called "authenticated" that manages a JWT, this allows the application to be stateless and facilitates horizontal scaling, since the API consumption can be used by millions of users, and the server does not need to save the session user.

<strong> Testable </strong>

The application has a file called tests.js in the "test" folder, it already has unit tests, it must be taken into account that unit tests depend on the situation, so if you want to run them again you have to create new cases. Here I show an image of the execution of the unit tests and the report of the coverage of those tests.

### Unittests result
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/unittest.PNG)
### Coverage result
![alt text](https://wittline.github.io/RESTful-APIs-Nodejs/images/coverage.PNG)

# Contributing and Feedback
Any ideas or feedback about this research?. Help me to improve it.

# Authors
- Created by <a href="https://www.linkedin.com/in/ramsescoraspe"><strong>Ramses Alexander Coraspe Valdez</strong></a>
- Created on April, 2020

# License
This project is licensed under the terms of the MIT license.
