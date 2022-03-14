/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable('customer', function (table) {
        table.increments('id').primary()
        table.string('firstName').notNullable()
        table.string('lastName').notNullable()
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.boolean('IsActive').defaultTo(true);
        table.integer('accountId').notNullable().unsigned().references('id').inTable('account');
        table.timestamps(true, true)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('customer');
};
