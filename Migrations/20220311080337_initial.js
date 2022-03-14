/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  
    
return knex.schema.createTable('account', function (table) {
        table.increments('id').primary()
        table.string('reference').notNullable().unique();
        table.double('balance').defaultTo(0).notNullable();
        table.boolean('IsActive').defaultTo(true);
        table.timestamps(true, true)
    });



    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    
 
        knex.schema.dropTable('account');
       
   
};
