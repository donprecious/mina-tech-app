import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('withdraws', table => {
    table.string('id').primary();
    table.string('referenceNo').unique();
    table.decimal('amount').notNullable();
    table.string('currencyCode').notNullable();
    table.string('userId').notNullable();
    table.foreign('userId').references('id').inTable('users');
    table.string('narration');
    table.string('transactionId').notNullable();
    table.foreign('transactionId').references('id').inTable('transactions');
    table.string('providerResponse');
    table.dateTime('createdAt').notNullable();
    table.dateTime('updatedAt');
    table.dateTime('deletedAt');
    table.boolean('isDeleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('withdraws');
}
