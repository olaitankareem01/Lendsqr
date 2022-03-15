const app = require('../app.js');
const request = require('supertest');
const AccountService = require('../Services/AccountService.js');
const acctService = new AccountService();
const AccountRepository = require('../Repositories/AccountRepository.js');
const acctRepo = new AccountRepository();


const WithdrawFundApiTest = () =>{

    it('It should withdraw fund to a bank account and respond with status 200', async () => {
        //Arrange
        const FindAccount = jest.spyOn(acctRepo,'FindAccount');
        FindAccount.mockReturnValue(
            [{
            id: 2,
            accountRef: "acct_1KdCIX2eRoVSIWDn",   
            balance: 5000
             }]
        
        )
        const WithdrawFunctionSpy = jest.spyOn(acctService, 'WithdrawFund');
        
        await WithdrawFunctionSpy.mockReturnValue({
            accountNo: "0342527945",
            amount: 3000,
            balance: 258800
         });


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/WithdrawFund')
            .set("Accept", "application/json")
            .send({
                yourWalletId: "acct_1KdCIX2eRoVSIWDn",   
                amount: 3000,
                currency:"usd",
                description:"gift",
                accountName:"kareem rahman",
                accountNo:"0342527945",
                country:"US"
            });
       
    
        //Assert
        expect(res.status).toEqual(200);

    });

    it('It should return 400 to for  insufficient balance', async () => {
        //Arrange
        const FindAccount = jest.spyOn(acctRepo,'FindAccount');
        FindAccount.mockReturnValue(undefined);
        
        const WithdrawFunctionSpy = jest.spyOn(acctService, 'WithdrawFund');
        
        await WithdrawFunctionSpy.mockReturnValue(null);


        //Act
        const res = await request('http://localhost:5000')
            .post('/Account/WithdrawFund')
            .set("Accept", "application/json")
            .send({
                yourWalletId: "acct_1KdCIX2eRoVSIDn",   
                amount: 9000,
                currency:"usd",
                description:"gift",
                accountName:"kareem rahman",
                accountNo:"0342527945",
                country:"US"
            });
       
    
        //Assert
        expect(res.status).toEqual(400);

    });

}


module.exports = WithdrawFundApiTest;