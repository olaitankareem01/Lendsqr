const app = require('../app.js');
const request = require('supertest');
const AccountService = require('../Services/AccountService.js');
const acctService = new AccountService();



const TransferFundApiTest = () =>{

    it('It should transfer fund to an account and respond with status 200', async () => {
        //Arrange
        const CreateFunctionSpy = jest.spyOn(acctService, 'TransferFund');
        
       
        await CreateFunctionSpy.mockReturnValue({
                       balance: 44000
                  });


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/Deposit')
            .set("Accept", "application/json")
            .send({
                yourWalletId: "acct_1KdCIX2eRoVSIWDn",   
                recipientWalletId: "acct_1KdJwD2fiXS7OZzJ",
                amount: 80,
                currency:"usd",
                description:"gift"
            
            });
       
        //Assert
        expect(res.status).toEqual(200);

    });
}


module.exports = TransferFundApiTest;