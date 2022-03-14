const knex = require('knex');
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database:process.env.DATABASE ,
    user:   process.env.DB_USER,
    password:  process.env.DB_PASSWORD
  },
  useNullAsDefault: true
});

module.exports = db;