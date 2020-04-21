let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index')



chai.should();
chai.use(chaiHttp);



describe('Brokerage API', () =>{

    /**
     * Test POST route
     */     

     describe('POST api/accounts', () => {
        
        it('It should POST a new account',(done) => {
            const account = {
                cash: 5000
            };
            chai.request('http://localhost:3977/')
                .post('api/accounts')
                .send(account)
                .end((err, response) => {
                    response.should.have.status(202); 
                    response.body.should.have.property('business_error');
                    response.body.should.have.property('cash').eq(5000);
                done();                    
                });
        });

     });

    /**
     * Test POST route by id account in orders
     */     



});