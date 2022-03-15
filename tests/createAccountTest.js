const app = require('../app.js');
const request = require('supertest');
const AccountService = require('../Services/AccountService.js');
const acctService = new AccountService();



const CreateAccountApiTest = () =>{

    it('It should create an account respond with status 200', async () => {
        //Arrange
        const CreateFunctionSpy = jest.spyOn(acctService, 'CreateAccount');
        
       
        await CreateFunctionSpy.mockReturnValue(
                  {
                    status: true,
                    email:"roa@gmail.com",
                    accountRef:"acct_1Kdhfy2cuJ4oqWas",
                    balance: 0.00
                  }
                  
                );

        // const agent = request(app);

        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Create')
            .set("Accept", "application/json")
            .send({
                email:"roa@gmail.com",
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

        // const agent = request(app);

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