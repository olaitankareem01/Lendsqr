const app = require('../app.js');
const request = require('supertest');
const AccountService = require('../Services/AccountService.js');
const acctService = new AccountService();
const AccountRepository = require('../Repositories/AccountRepository.js');
const acctRepo = new AccountRepository();
const CustomerRepository = require('../Repositories/CustomerRepository.js');
const custRepo = new CustomerRepository();


jest.setTimeout(10000)
const CreateAccountApiTest = () =>{

    it('It should create an account respond with status 200', async () => {
        //Arrange
        const FindCustomer =  jest.spyOn(custRepo,'FindCustomer');
        FindCustomer.mockReturnValue(undefined);
        const CreateFunctionSpy = jest.spyOn(acctService, 'CreateAccount');
         
        await CreateFunctionSpy.mockReturnValue(
                  {
                    status: true,
                    email:"adeniyi@gmail.com",
                    accountRef:"acct_1Kdhfy2cuJ4otgh",
                    balance: 0.00
                  }
                  
                );

        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Create')
            .set("Accept", "application/json")
            .send({
                email:"adeniyi@gmail.com",
                password:"rahman",
                lastName:"kareem",
                firstName:"rahman"
            
            });
         
        //Assert
        expect(res.status).toEqual(200);

    });

    
    it('It should return 400 for an account that already exist', async () => {
        //Arrange
        const CreateFunctionSpy = jest.spyOn(acctService, 'CreateAccount');
        
       
        await CreateFunctionSpy.mockReturnValue({
                    status:false,
                    message: " "
                  });


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Create')
            .set("Accept", "application/json")
            .send({
                email:"rka@gmail.com",
                password:"rahman",
                lastName:"kareem",
                firstName:"rahman"
            
            });
         
        //Assert
        expect(res.status).toEqual(400);

    });

    
}


module.exports = CreateAccountApiTest;