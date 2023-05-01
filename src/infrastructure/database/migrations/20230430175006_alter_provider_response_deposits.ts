import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('deposits', table => {
    table.text('providerResponse').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('deposits', table => {
    table.text('providerResponse').alter();
  });
}
