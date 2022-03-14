var db  = require('../db');


class CustomerRepository{


  async RegisterCustomer(lastName,firstName,email,password,accountId){
      
      return await db('customer').insert({
          lastName:lastName,
          firstName:firstName,
          email:email,
          password: password,
          accountId:accountId
       });
      
  }


  async FindCustomer(email){
    return await db('customer').where('email','=',`${email}`);
  }





}

module.exports = CustomerRepository;