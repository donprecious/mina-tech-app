import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('wallets', table => {
    table.string('id').primary();
    table.string('userId').notNullable();
    table.foreign('userId').references('id').inTable('users');
    table.decimal('amount').notNullable();
    table.string('currencyCode').notNullable();
    table.dateTime('createdAt').notNullable();
    table.dateTime('updatedAt');
    table.dateTime('deletedAt');
    table.boolean('isDeleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('wallets');
}
