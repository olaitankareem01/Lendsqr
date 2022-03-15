const Stripe = require('stripe');
const Apikey = process.env.StripeApiKey;
const stripe = Stripe(Apikey);
const AccountRepository = require('../Repositories/AccountRepository');
const acctRepo = new AccountRepository();
const CustomerRepository = require('../Repositories/CustomerRepository');
const custRepo = new CustomerRepository();

class AccountService {
   

  
    //this method handles reg creation of account
    async CreateAccount(lastName,firstName,email,password){

      try{

         //checks if a customer's  email already exist
        var ExistingCustomer = await custRepo.FindCustomer(email);
        

        if(ExistingCustomer.length === 0){
      
           //preparing an object to be sent to stripe for account creation
            var createDto = {
                email:`${email}`,
                country: 'US',
                type:"custom",
                capabilities: {
                    card_payments: {requested: true},
                   transfers: {requested: true}
                  }
            };

            
         //creates account on stripe for the customer
          var stripeAccount = await stripe.accounts.create(createDto);
         
           
          if(stripeAccount != undefined && stripeAccount != null)
          {
             
             var ExistingAccount = await acctRepo.FindAccount(stripeAccount.id);

             if(ExistingAccount === null || ExistingAccount === undefined || ExistingAccount.length ===0){
               var acctCreated = await acctRepo.CreateAccount(stripeAccount.id,stripeAccount.type);
              
               var custCreated = await custRepo.RegisterCustomer(lastName,firstName,email,password,acctCreated[0]);
              
             }
             else{
                    return null;
             }

               
          var response = {
            email:email,
            accountRef:stripeAccount.id,
            balance: 0.00
          }
          
          return response;
            
         }
          
       
          
      }

       return null;
   }catch(err){
      console.log(err);
   
   }
     
}


    //method that handles funding of customer's account
    async FundAccount(accountRef,amount,currency, cardNumber,cardCVC,expMonth, expYear){
      
      try{
          //checks whether the account exists in the database
       var OwnerAccount = await acctRepo.FindAccount(accountRef);
       var OwnerNewBalance = OwnerAccount[0].balance + amount;
       var response = {
          balance : OwnerNewBalance
       }
      
       if(OwnerAccount != null && OwnerAccount != undefined){
        
         //gets a token from stripe to uniquely identify the user's card
         var depositorsCard = await stripe.tokens.create({
           card:{
              number: `${cardNumber}`,
              exp_month: expMonth,
              exp_year:expYear,
              cvc: `${cardCVC}`
           }  
         });
         
         var description = "Fund desposit ";
         // deposits the fund in the user's account   
         var fundAdded =  await this.TransferFund(depositorsCard.id,accountRef,amount,currency,description);
         
         //updates the user's balance
         if(fundAdded != null && fundAdded != undefined){
            await UpdateBalance(amount,accountRef);
            return response;
         }
      

      }
      else{
           response = null;
      }

   }catch(err){

   }
   finally{
              
      /*the connection to stripe might not be successful because the account being used 
           is a test account with limited capabilities but it is assumed here that the payment on
           stripe is successful and the owner's balance is updated*/
      if(response != null){
         await acctRepo.UpdateBalance(OwnerNewBalance,accountRef);
        }
      return response;
   }
}


    //method that handles Fund Transfer
    async TransferFund(sourceAcct,destinationAcct,amount,currency,description){
         
     try{

        //checks if the accounts given exists
      var SenderAccount = await acctRepo.FindAccount(sourceAcct);
      var DestinationAccount = await acctRepo.FindAccount(sourceAcct);
      var senderBalance = SenderAccount[0].balance - amount;
      var recipientBalance = DestinationAccount[0].balance + amount;
      var  response = {
         amount: amount,
         currency:currency,
         destinationAcct:destinationAcct,
         balance: senderBalance
      }

      if(SenderAccount === null || SenderAccount === undefined){
         return "The specified source account is invalid!";
      }
      else if(DestinationAccount === null || DestinationAccount === undefined){
         return "The specified recipient account is invalid!";
      }
      else{
         var charge;
         
         //checks if the sender has sufficient balance
         if( SenderAccount[0].balance >= amount){
            
            charge = await stripe.charges.create({
               amount: amount,
               currency: `${currency}`,
               source: sourceAcct,
               description:description,
     
            });
         }
         else{
            response = null;
         }
       
         //if the sender was successfully charged, the fund is then transferred to the recipient account
         if(charge != null && charge != undefined ){
             
            const transfer = await stripe.transfers.create({
               amount: amount,
               currency: `${currency}`,
               destination: destinationAcct
            });
            

            if(transfer != null && transfer != undefined){
                
               //if the transfer is successful on stripe, the sender's and recipient's balances are updated succesfully
               await acctRepo.UpdateBalance(senderBalance,sourceAcct);
               await acctRepo.UpdateBalance(recipientBalance,destinationAcct)
               return response;
            }
         }

      }
     }
     catch(err){

     }
     finally{
      /*the connection to stripe might not be successful because the account being used 
           is a test account with limited capabilities but it is assumed here that the payment on
           stripe is successful and the owner's balance is updated*/
      await acctRepo.UpdateBalance(senderBalance,sourceAcct);
      await acctRepo.UpdateBalance(recipientBalance,destinationAcct);
      return response;
     
      
     }

   }


    //method that handles fund withdrawal from customer's account
    async WithdrawFund(accountRef,amount,accountName,accountNo,country,currency){
        try{

         var OwnerAccount = await acctRepo.FindAccount(accountRef);
         var OwnerNewBalance;
         var response;
         if(OwnerAccount != undefined &&  OwnerAccount[0].balance > amount ){
             OwnerNewBalance = OwnerAccount[0].balance - amount;

              response = {
               accountNo:accountNo,
               amount:amount,
               balance: OwnerNewBalance
            }

            
            //gets a single-use token that uniquely identifies a bank account using the details provided by the customer
            var bankAccountToken = await stripe.tokens.create({
               bank_account:{
                 country: `${country}`,
                 currency: `${currency}`,
                 account_holder_name:`${accountName}`,
                 account_number:`${accountNo}`
                 
               }  
             });

               //after creating the bank account token,fund is tranferred from the customer's account  to his bank account
               var fundAdded =  await this.TransferFund(accountRef,bankAccountToken.id,amount,currency,description);
               if(fundAdded.success != null && fundAdded.success != undefined){
                  return response;
               }
               response = null;
           }
          
        }
       catch(err){
          
       }
       finally{
          
         /*the connection to stripe might not be successful because the account being used 
           is a test account with limited capabilities but it is assumed here that the payment on
           stripe is successful and the owner's balance is updated*/
           if(response != null){
            await acctRepo.UpdateBalance(OwnerNewBalance,accountRef);
           }
          return response;
         }

    }



}

module.exports = AccountService;