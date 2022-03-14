var db  = require('../db');


class AccountRepository{

   async  CreateAccount(ref,type){
      var AccountCreated = await db('account').insert({
        reference: ref
      });
  
      return AccountCreated;
    }

   async FindAccount(accountRef){
      
      return db('account').where('reference','=',`${accountRef}`);
   }

   async UpdateBalance(balance, accountRef){
      return db('account').update('balance',balance).where('reference',accountRef);
   }
}

module.exports = AccountRepository;