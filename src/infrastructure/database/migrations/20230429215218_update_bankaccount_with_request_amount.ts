import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('bankAccounts', table => {
    table.decimal('requestedAmount').nullable().defaultTo(0.0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bankAccounts', table => {
    table.dropColumn('requestedAmount');
  });
}
