// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 **/
require('babel-register');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
 
module.exports = {

  development: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database:process.env.DATABASE ,
      user:   process.env.DB_USER,
      password:  process.env.DB_PASSWORD
    },
    migrations: {
      directory: path.join(__dirname, './migrations'),
    }

  },

  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
