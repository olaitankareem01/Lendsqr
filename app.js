const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const res = require("express/lib/response");
dotenv.config();
const port = process.env.PORT;
const app = express();
const AccountService = require("./Services/AccountService");
const acctService = new AccountService();





app.use(
    cors({
      exposedHeaders: ["token"],
    })
  );

  
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  
  app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);

  app.get('/',(req,res)=>res.send("Hello world"));

  app.post('/Account/Create', async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    var response = await acctService.CreateAccount(lastName,firstName,email,password);
    if(response != null){
      res.status(200).send(response)
    }
    else{
      res.status(500).send("An error occurred!")
    }

  });

  app.post('/Account/Deposit',async(req,res)=>{

    let accountRef = req.body.yourWalletId;
    let amount = req.body.amount;
    let cardNumber = req.body.cardNumber;
    let cardCVC = req.body.cardCVC;
    let expMonth = req.body.expMonth;
    let expYear = req.body.expYear;
    let currency = req.body.currency 
    
    console.log(expYear);
    let response = await acctService.FundAccount(accountRef,amount,currency,cardNumber,cardCVC,expMonth,expYear);

    if(response != null){
      return res.status(200).send({
        status: 200,
        data: response,
        message: `Your account has been successfully created and your wallet ID is ${response.accountRef} `
      });
    }
    else{
      return res.status(500).send("An error occurred")
    }
  });
  
  app.post('/Account/FundTransfer', async(req, res) =>{
    
    let ownersAcct = req.body.yourWalletId;
    let recipientAcct = req.body.recipientWalletId;
    let amount = req.body.amount;
    let currency = req.body.currency;
    let description = req.body.description;
    let response = await acctService.TransferFund(ownersAcct,recipientAcct,amount,currency,description);

    if(response != null){
      return res.status(200).send({
        status: 200,
        data: response 
      });
    }
    else{
      return res.status(500).send("An error occurred");
    }
  });

  app.post('/Account/WithdrawFund', async(req,res) => {
    
    let accountRef = req.body.yourWalletId;
    let amount = req.body.amount;
    let accountName = req.body.accountName;
    let accountNo = req.body.accountNo;
    let country = req.body.country;
    let currency = req.body.currency;
    let response = await acctService.WithdrawFund(accountRef,amount,accountName,accountNo,country,currency);

    if(response != null){
      return res.status(200).send({
        status: 200,
        data: response 
      });
    }
    else{
      return res.status(500).send("An error occurred");
    }
  });

  app.listen(port, console.log(`app is listening at ${port}`))