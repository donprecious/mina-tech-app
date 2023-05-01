import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const columnExists = await knex.schema.hasColumn('bankAccounts', 'isTemporary');

  if (!columnExists) {
    return knex.schema.table('bankAccounts', table => {
      table.boolean('isTemporary').notNullable().defaultTo(false);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('bankAccounts', table => {
    table.dropColumn('isTemporary');
  });
}
