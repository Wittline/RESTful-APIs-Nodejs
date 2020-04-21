let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index')



chai.should();
chai.use(chaiHttp);



describe('Brokerage API', () =>{

   

     describe('POST api/accounts', () => {
        
        it('It should POST a new account',(done) => {
            const account = {
                cash: 8000
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts')
                .send(account)
                .end((err, response) => {
                    response.should.have.status(202);                     
                    response.body.should.have.property('cash').eq(8000);
                done();                    
                });
        });

     });

 
    describe('POST api/accounts', () => {
        
        it('It should NOT POST a new account',(done) => {
            const account = {
                c: 5000
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts')
                .send(account)
                .end((err, response) => {
                    response.should.have.status(404); 
                    response.body.should.have.property('business_error');
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587481672 ,
                operation: 'NOTHING',
                issuer_name: 'T1',
                total_shares: 2 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });


    describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587481672 ,
                operation: 'BUY',
                issuer_name: 'T1',
                total_shares: 2 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587481675,
                operation: 'BUY',
                issuer_name: 'T2',
                total_shares: 2 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587481672,
                operation: 'BUY',
                issuer_name: 'T1',
                total_shares: 2 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587489999,
                operation: 'SELL',
                issuer_name: 'T1',
                total_shares: 1 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587499999,
                operation: 'SELL',
                issuer_name: 'T1',
                total_shares: 2 ,
                share_price: 100
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });

     describe('POST api/accounts/:id/orders', () => {
        
        it('It should  POST a new account',(done) => {
            const id = '5e9f0f4cb456b45dc4b965ff'
            const order = {
                timestamp: 1587999999,
                operation: 'BUY',
                issuer_name: 'T3',
                total_shares: 10 ,
                share_price: 1000
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts/' + id + '/orders')
                .send(order)
                .end((err, response) => {
                    response.should.have.status(202);                     
                done();                    
                });
        });

     });     
});