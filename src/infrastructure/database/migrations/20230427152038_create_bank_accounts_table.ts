import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bankAccounts', table => {
    table.string('id').primary();
    table.string('userId').notNullable();
    table.foreign('userId').references('id').inTable('users');
    table.string('accountNumber').notNullable();
    table.string('accountName').notNullable();
    table.string('bankName').notNullable();
    table.string('bankCode').notNullable();
    table.boolean('isVirtual').defaultTo(false);
    table.dateTime('createdAt').notNullable();
    table.dateTime('updatedAt');
    table.dateTime('deletedAt');
    table.boolean('isDeleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bankAccounts');
}
