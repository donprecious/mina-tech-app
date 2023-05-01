import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.string('id').primary();
    table.string('email', 45).notNullable();
    table.string('password', 255).notNullable();
    table.string('firstname').nullable();
    table.string('lastname').nullable();
    table.string('phoneNumber').nullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
