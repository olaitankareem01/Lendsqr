const createAccountTest = require('./tests/createAccountTest.js');
describe('Test Create Account Endpoint', createAccountTest);
const fundAccountTest = require('./tests/fundAccountTest.js');
describe('Test Fund Account Endpoint', fundAccountTest);
const transferFundTest = require('./tests/transferFundTest.js');
describe('Test transfer Fund Endpoint', transferFundTest);
const withdrawFundTest = require('./tests/withdrawFundTest');
describe('Test withdraw Fund Endpoint', withdrawFundTest);