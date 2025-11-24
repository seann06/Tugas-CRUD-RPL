import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Koordinats extends BaseSchema {
  protected tableName = 'koordinats'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_koordinat')
      table.string('nama', 255).notNullable()
      table.decimal('latitude', 10, 7).notNullable()
      table.decimal('longitude', 10, 7).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
