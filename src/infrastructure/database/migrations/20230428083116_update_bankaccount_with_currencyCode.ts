import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('bankAccounts', table => {
    table.string('currencyCode').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('bankAccounts', table => {
    table.string('currencyCode');
  });
}
