const app = require('../app.js');
const request = require('supertest');
const AccountService = require('../Services/AccountService.js');
const acctService = new AccountService();



const FundAccountApiTest = () =>{

    it('It should create fund an account and respond with status 200', async () => {
        //Arrange
        const CreateFunctionSpy = jest.spyOn(acctService, 'FundAccount');
        
       
        await CreateFunctionSpy.mockReturnValue({
                       balance: 44000
                  });


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Deposit')
            .set("Accept", "application/json")
            .send({
                 yourWalletId: "acct_1KdCIX2eRoVSIWDn",
                 amount: 3000,
                 cardNumber:"4242424242424242",
                 cardCVC:"234",
                 expMonth:4,
                 expYear: 2025,
                 currency:"US"
            });
      
        //Assert
        expect(res.status).toEqual(200);

    });

    it('It should return not found for invalid account and respond with status 404', async () => {
        //Arrange
        const CreateFunctionSpy = jest.spyOn(acctService, 'FundAccount');
        
       
        await CreateFunctionSpy.mockReturnValue(null);


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Deposit')
            .set("Accept", "application/json")
            .send({
                 yourWalletId: "acct_1KdCIX2eRoVSIn",
                 amount: 3000,
                 cardNumber:"4242424242424242",
                 cardCVC:"234",
                 expMonth:4,
                 expYear: 2025,
                 currency:"US"
            });
      
        //Assert
        expect(res.status).toEqual(404);

    });
}


module.exports = FundAccountApiTest;