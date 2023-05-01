import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('deposits', table => {
    table.string('narration', 1000).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('deposits', table => {
    table.string('narration', 255).alter(); // Change this to the previous length
  });
}
